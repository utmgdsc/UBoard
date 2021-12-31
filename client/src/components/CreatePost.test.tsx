import React from 'react';
import CreatePost from './CreatePost';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';

let container: HTMLElement | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    render(<CreatePost />);
  });
  screen.getByTestId('newPostButton').click();
});

afterEach(() => {
  // cleanup on exiting
  if (container != null) {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
    cleanup();
  }
});

describe('verifying launch of create post component', () => {
  it('should only show dropdown until a post type is selected', () => {
    const postForm = screen.getByTestId('post-form');

    expect(postForm).not.toBeVisible();

    fireEvent.mouseDown(screen.getByLabelText('Select a post type'));
    const dropdown = within(screen.getByRole('listbox')); 
    fireEvent.click(dropdown.getByText('Events'));

    expect(postForm).toBeVisible();
  });

  it('should display location fields if "Events" is selected', () => {
    expect(screen.getByTestId('online-toggler')).not.toBeVisible();

    fireEvent.mouseDown(screen.getByLabelText('Select a post type'));
    const dropdown = within(screen.getByRole('listbox')); 
    fireEvent.click(dropdown.getByText('Events'));
    
    expect(screen.getByTestId('online-toggler')).toBeVisible();
  });

  it('should not display location fields if "Events" is not selected', () => {
    expect(screen.getByTestId('online-toggler')).not.toBeVisible();

    fireEvent.mouseDown(screen.getByLabelText('Select a post type'));
    const dropdown = within(screen.getByRole('listbox')); 
    fireEvent.click(dropdown.getByText('Clubs'));
    
    expect(screen.getByTestId('online-toggler')).not.toBeVisible();
  });

  it('shows the preview button as disabled', () => {
    // get the preview button
    expect(screen.getByTestId('previewButton')).toBeDisabled();
  });

  it('should enable the preview button after providing required fields', () => {
    // input title
    const titleTextField = screen.getByPlaceholderText('title');
    fireEvent.change(titleTextField, { target: { value: 'Test Club' } });
    // input body
    const bodyTextField = screen.getByTestId('bodyTextField');
    fireEvent.change(bodyTextField, {
      target: { value: 'This should be at least 25 characters long' },
    });
    fireEvent.blur(bodyTextField);
    expect(screen.getByTestId('previewButton')).not.toBeDisabled();
  });

  it('renders `previewPopUp` component upon clicking Preview', () => {
    // input title
    fireEvent.change(screen.getByPlaceholderText('title'), {
      target: { value: 'Test Club' },
    });
    // input body
    const bodyTextField = screen.getByTestId('bodyTextField');
    fireEvent.change(bodyTextField, {
      target: { value: 'This should be at least 25 characters long' },
    });
    fireEvent.blur(bodyTextField);
    // pop up should render
    screen.getByTestId('previewButton').click();
    expect(screen.getByTestId('PreviewPopUpComponent')).toBeInTheDocument();
  });

  it('closes the dialog when clicked on `Back` button', () => {
    expect(screen.getByTestId('newPostButton')).toBeInTheDocument();
  });

  it('Toggling online event disables the map', () => {
    screen.getByTestId('online-toggler').click();

    expect(screen.queryByTestId('picker-map')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pac-test')).not.toBeInTheDocument();
    expect(screen.getByTestId('online-loc-input')).toBeInTheDocument();
  });

  it('Switching between online to offline event clears previous input', () => {
    const toggler = screen.getByTestId('online-toggler');
    toggler.click();

    const online = screen
      .getByTestId('online-loc-input')
      .querySelector('input');

    fireEvent.change(online!, {
      target: {
        value: 'online123',
      },
    });

    expect(online?.value).toEqual('online123');
    toggler.click();
    toggler.click();
    expect(
      screen.getByTestId('online-loc-input').querySelector('input')?.value
    ).toEqual('');
    toggler.click();

    const offline = screen.getByTestId('pac-input-test').querySelector('input');
    fireEvent.change(offline!, {
      target: {
        value: 'addr',
      },
    });
    expect(offline?.value).toEqual('addr');
    toggler.click();
    expect(screen.queryByTestId('pac-input-test')).not.toBeInTheDocument();
    toggler.click();
    expect(
      screen.getByTestId('pac-input-test').querySelector('input')?.value
    ).toEqual('');
  });

  it('View map switch properly hides/shows map', () => {
    screen.getByTestId('map-toggle').click();
    const map = screen.getByTestId('picker-map');
    expect(map.style.height).toEqual('0px');
    screen.getByTestId('map-toggle').click();
    expect(map.style.height).not.toEqual('0px');
  });

  it('entering a tag and hitting space will add tag styling and empty the field', () => {
    const tagTextField = screen.getByPlaceholderText(
      'Clubs Math MCS'
    ) as HTMLInputElement;

    fireEvent.change(tagTextField, {
      target: { value: 'tag1 ' },
    });

    // ensure input is cleared, and tag elem is added
    expect(tagTextField.value).toBe('');
    expect(screen.getByText('tag1')).toBeInTheDocument();
  });

  it('entering a tag and unfocusing the input box will add a new tag', () => {
    const tagTextField = screen.getByPlaceholderText(
      'Clubs Math MCS'
    ) as HTMLInputElement;

    fireEvent.change(tagTextField, {
      target: { value: 'tag1' },
    });

    fireEvent.blur(tagTextField);
    expect(tagTextField.value).toBe('');
    expect(screen.getByText('tag1')).toBeInTheDocument();
  });

  it('verify that 3 tags disable the input, and deleting one re-enables the input', () => {
    const tagTextField = screen.getByPlaceholderText(
      'Clubs Math MCS'
    ) as HTMLInputElement;

    fireEvent.change(tagTextField, {
      target: { value: 'tag1' },
    });
    fireEvent.keyDown(tagTextField, {
      key: 'Enter',
    });
    fireEvent.change(tagTextField, {
      target: { value: 'tag2' },
    });
    fireEvent.keyDown(tagTextField, {
      key: 'Enter',
    });
    fireEvent.change(tagTextField, {
      target: { value: 'tag3' },
    });
    fireEvent.keyDown(tagTextField, {
      key: 'Enter',
    });
    expect(tagTextField.value).toBe('');
    expect(tagTextField.disabled).toBeTruthy();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('tag2-clicker'));

    expect(tagTextField.disabled).toBeFalsy();
  });

  it('pressing backspace will put the tag back in the input box', () => {
    const tagTextField = screen.getByPlaceholderText(
      'Clubs Math MCS'
    ) as HTMLInputElement;

    fireEvent.change(tagTextField, {
      target: { value: 'tag1 ' },
    });

    fireEvent.change(tagTextField, {
      target: { value: 'tag2 ' },
    });

    expect(tagTextField.value).toBe('');
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();

    fireEvent.keyDown(tagTextField, {
      key: 'Backspace',
    });
    expect(tagTextField.value).toBe('tag2');
  });
});
