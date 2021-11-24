import { render, screen, cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { POSTS_PER_PAGE } from '../containers/PostDashboard';
import PostPreview from '../components/PostPreview';
import PostDashboard from '../containers/PostDashboard';

import ServerApi, { PostUserPreview } from '../api/v1';

function fakePostPreview(
  title: string,
  body: string,
  createdAt: string
): PostUserPreview {
  return {
    id: (Math.random() * 100).toString(),
    thumbnail: 'placeholder',
    body,
    title,
    createdAt,
    User: {
      id: 'user-123',
      firstName: 'John',
      lastName: 'Locke',
    },
  };
}

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => jest.fn(),
}));

beforeEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('Dashboard Interaction', () => {
  it('Account Menu properly opens', () => {
    render(<PostDashboard setAuthed={{} as React.Dispatch<React.SetStateAction<boolean>>}/>);
    const menuBtn = screen.getByTestId('test-acc-menu-icon');
    expect(screen.queryByTestId('test-post-settings-menu')).toBeNull();
    expect(menuBtn).toBeInTheDocument();

    const menuItems = ['My Posts', 'Logout'];
    // Initially menu items should not show up
    for (let i = 0; i < menuItems.length; i++) {
      expect(screen.queryByText(menuItems[i])).not.toBeInTheDocument();
    }

    // menu open
    menuBtn.click();
    for (let i = 0; i < menuItems.length; i++) {
      expect(screen.getByText(menuItems[i])).toBeInTheDocument();
    }
  });
});

describe('Post Preview correctly displayed', () => {
  it('Ensure title, author, body, and date is displayed', () => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2021-11-22T01:41:01'));
    const post = fakePostPreview(
      'This is a testing post',
      'Yes, I understand that this is a testing post! Woow',
      '2021-11-20T01:41:01'
    );

    render(
      <PostPreview
        postUser={post}
        setOpenedPost={
          {} as any as React.Dispatch<React.SetStateAction<boolean>>
        }
      />
    );

    expect(screen.getByText(`${post.title}...`)).toBeInTheDocument();
    expect(screen.getByText(`${post.body}...`)).toBeInTheDocument();
    expect(
      screen.getByText(
        `2 day(s) ago by ${post.User.firstName} ${post.User.lastName}`
      )
    ).toBeInTheDocument();
  });

  it('Check time for exactly 1 hour ago', () => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2021-11-01T02:41:01'));

    const post = fakePostPreview(
      'This is a testing post',
      'Yes, I understand that this is a testing post! Woow',
      '2021-11-01T01:41:01'
    );

    render(
      <PostPreview
        postUser={post}
        setOpenedPost={
          {} as any as React.Dispatch<React.SetStateAction<boolean>>
        }
      />
    );

    expect(
      screen.getByText(
        `1 hour(s) ago by ${post.User.firstName} ${post.User.lastName}`
      )
    ).toBeInTheDocument();
  });

  it('Check time for exactly 1 day ago', () => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2021-11-02T02:41:01'));

    const post = fakePostPreview(
      'This is a testing post',
      'Yes, I understand that this is a testing post! Woow',
      '2021-11-01T01:41:01'
    );

    render(
      <PostPreview
        postUser={post}
        setOpenedPost={
          {} as any as React.Dispatch<React.SetStateAction<boolean>>
        }
      />
    );

    expect(
      screen.getByText(
        `1 day(s) ago by ${post.User.firstName} ${post.User.lastName}`
      )
    ).toBeInTheDocument();
  });

  it('Check time for exactly 30 days ago', () => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2021-12-01T01:41:01'));

    const post = fakePostPreview(
      'This is a testing post',
      'Yes, I understand that this is a testing post! Woow',
      '2021-11-01T01:41:01'
    );

    render(
      <PostPreview
        postUser={post}
        setOpenedPost={
          {} as any as React.Dispatch<React.SetStateAction<boolean>>
        }
      />
    );

    expect(
      screen.getByText(
        `30 day(s) ago by ${post.User.firstName} ${post.User.lastName}`
      )
    ).toBeInTheDocument();
  });

  it('Ensure long text is truncated', () => {
    render(
      <PostPreview
        postUser={fakePostPreview(
          `${'a'.repeat(200)}`,
          `${'b'.repeat(300)}`,
          '2021-11-22T01:41:01.112Z'
        )}
        setOpenedPost={
          {} as any as React.Dispatch<React.SetStateAction<boolean>>
        }
      />
    );

    expect(screen.getByText(`${'a'.repeat(28) + '...'}`)).toBeInTheDocument();
    expect(screen.getByText(`${'b'.repeat(150) + '...'}`)).toBeInTheDocument();
  });

  it('Ensure pagination works properly when many posts are made', async () => {
    let posts: PostUserPreview[] = [];

    for (let i = 0; i < POSTS_PER_PAGE; i++) {
      posts[i] = fakePostPreview(
        `fake title ${i}`,
        'fake body post hello aaaaa lolllll',
        '2021-11-20'
      );
    }
    expect(posts.length).toBe(POSTS_PER_PAGE);

    posts.push(
      fakePostPreview(
        'I will be on pg2',
        'fake body 33333333 eee',
        '2021-11-10'
      )
    );

    const mockFetch = jest
      .spyOn(ServerApi.prototype, 'fetchRecentPosts')
      .mockImplementation((limit, offset) => {
        const results = posts.slice(offset, limit + offset);
        return Promise.resolve({
          status: 200,
          data: {
            data: {
              result: results,
              count: results.length,
              total: posts.length,
            },
          },
        });
      });

    await act(async () => {
      render(<PostDashboard />);
    });

    for (let i = 0; i < POSTS_PER_PAGE; i++) {
      expect(screen.getByText(posts[i].title + '...')).toBeInTheDocument();
    }

    // This post exceeds max per page, so it is not here
    expect(screen.queryByText('I will be on pg2...')).not.toBeInTheDocument();

    // Switch to page 2, this page should only contain 1 post
    await act(async () => {
      const btn = screen
        .getByTestId('test-paginate')
        .querySelector('[aria-label="Go to page 2"]');

      expect(btn).toBeInTheDocument();
      (btn as HTMLButtonElement).click();
    });

    for (let i = 0; i < POSTS_PER_PAGE; i++) {
      expect(
        screen.queryByText(posts[i].title + '...')
      ).not.toBeInTheDocument();
    }
    expect(screen.getByText('I will be on pg2...')).toBeInTheDocument();
    mockFetch.mockClear();
  });
});
