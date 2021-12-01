import React from 'react';
import CreatePost from './CreatePost';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

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

  it('verify that more than 3 tags disable the tag input box', () => {
    const tagTextField = screen.getByPlaceholderText(
      'Clubs Math MCS'
    ) as HTMLInputElement;

    fireEvent.change(tagTextField, {
      target: { value: 'tag1 ' },
    });
    fireEvent.change(tagTextField, {
      target: { value: 'tag2 ' },
    });
    fireEvent.change(tagTextField, {
      target: { value: 'tag3 ' },
    });

    expect(tagTextField.value).toBe('');
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
  });

  it('ensure more than 3 tags cannot be added', () => {
    const tagTextField = screen.getByPlaceholderText(
      'Clubs Math MCS'
    ) as HTMLInputElement;

    fireEvent.change(tagTextField, {
      target: { value: 'tag1 ' },
    });
    fireEvent.change(tagTextField, {
      target: { value: 'tag2 ' },
    });
    fireEvent.change(tagTextField, {
      target: { value: 'tag3 ' },
    });
    expect(tagTextField.disabled).toBeTruthy();
  });

  it('pressing backspace will delete the last tag', () => {
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
    expect(screen.queryByText('tag2')).not.toBeInTheDocument();
  });

});
