import PostDashboard from '../containers/PostDashboard';
import { render, screen, cleanup, act } from '@testing-library/react';
import PostPreview from '../components/PostPreview';
import ServerApi, { PostUserPreview } from '../api/v1';
import axios, { AxiosResponse } from 'axios';
import { User } from 'models/user';

function fakePostPreview(
  title: string,
  body: string,
  createdAt: string
): PostUserPreview {
  return {
    id: '123-456',
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

function mockFetchPosts(mockPosts: PostUserPreview[]) {
  return {
    status: 200,
    data: {
      result: mockPosts,
      count: mockPosts.length,
      total: mockPosts.length,
      message: 'Success',
    },
  };
}

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => jest.fn(),
}));

const posts = [
  fakePostPreview(
    'fake title',
    'fake body post hello aaaaa lolllll',
    '2021-11-20'
  ),
    ];

const mockPost = {
      status: 200,
      data: {
        data: { result: posts, count: posts.length, total: posts.length },
      },
    };

// jest.mock('../api/v1/index', () => {
//   return jest.fn().mockImplementation(() => {
//     return {
//       ...jest.requireActual('../api/v1/index'),
//       fetchRecentPosts: jest.fn(() => Promise.resolve({ data: { status: 200, data: { mockPost } } })),
//       me: jest.fn(() => Promise.resolve({ status: 200 }))
//     }
//   });
// });



afterEach(() => {
  cleanup();
});


describe('Dashboard Interaction', () => {
  it('Pagination works as intended', () => {

const mockFetch = jest.spyOn(ServerApi.prototype, 'fetchRecentPosts').mockImplementation((limit, params) => 
  Promise.resolve({ status: 200, data: {
        data: {
          result: [] as PostUserPreview[],
          count: 1,
          total: 1,
          message: "asd",
        }
      }}) 
);

  act (() => {
    render(<PostDashboard />);
  });
    

    expect(screen.getByText('fake title...')).toBeInTheDocument();
  });

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
});
