import { render, screen, cleanup, fireEvent } from '@testing-library/react';
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
    render(<PostDashboard />);
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

  it('The oldest post is moved to page 2 after max posts per page is reached', async () => {
    let posts: PostUserPreview[] = [];

    for (let i = 0; i < POSTS_PER_PAGE; i++) {
      posts[i] = fakePostPreview(
        `fake title ${i}`,
        'fake body post hello aaaaa lolllll',
        '2021-11-20'
      );
    }

    posts.push(
      fakePostPreview(
        'I will be on pg2',
        'fake body 33333333 eee',
        '2021-11-10'
      )
    );

    const mockFetch = jest
      .spyOn(ServerApi.prototype, 'fetchRecentPosts')
      .mockImplementation(() =>
        Promise.resolve({
          status: 200,
          data: {
            data: {
              result: posts.slice(0, POSTS_PER_PAGE),
              count: POSTS_PER_PAGE,
              total: posts.length,
              message: 'asd',
            },
          },
        })
      );

    await act(async () => {
      render(<PostDashboard />);
    });

    for (let i = 0; i < POSTS_PER_PAGE; i++) {
      expect(screen.getByText(posts[i].title + '...')).toBeInTheDocument();
    }

    expect(screen.queryByText('I will be on pg2...')).not.toBeInTheDocument();

    expect(screen.getByTestId('test-paginate').querySelector('[aria-label="Go to page 2"]')).toBeInTheDocument();

    mockFetch.mockClear();
  });
});
