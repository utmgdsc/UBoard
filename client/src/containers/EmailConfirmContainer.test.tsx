import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';

import ServerApi from '../api/v1';
import { EmailConfirmContainer } from '.';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockNavigate,
  useLocation: () =>
    jest.fn().mockReturnValue({ state: { from: { pathname: undefined } } }),
}));

global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: {
    search: undefined,
  },
  writable: true,
});

beforeEach(() => {
  render(<EmailConfirmContainer />);
});

describe('email confirmation', () => {
  describe('on error', () => {
    it('should not confirm email if token is missing', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
      });
      expect(window.location.search).toEqual('');

      const form = screen.getByTestId('form');
      const mockConfirmEmail = jest
        .spyOn(ServerApi.prototype, 'confirmEmail')
        .mockImplementation(() =>
          Promise.resolve({ status: 204, data: { message: '' } })
        );

      // submit form and test
      await act(async () => {
        fireEvent.submit(form);
        await new Promise((r) => setTimeout(r, 1));
      });
      expect(mockConfirmEmail).not.toBeCalled();
    });
  });

  describe('on success', () => {
    it('should confirm email if token is valid', async () => {
      // set token in url
      const token = '?c=token123';
      Object.defineProperty(window, 'location', {
        value: {
          search: token,
        },
      });
      expect(window.location.search).toEqual(token);

      const form = screen.getByTestId('form');
      const mockResetPass = jest
        .spyOn(ServerApi.prototype, 'confirmEmail')
        .mockImplementation(() =>
          Promise.resolve({ status: 204, data: { message: '' } })
        );
      const formData = {
        token: 'token123',
      };

      // submit form and test
      await act(async () => {
        fireEvent.submit(form);
        await new Promise((r) => setTimeout(r, 1));
      });
      expect(mockResetPass).toBeCalledWith(formData);
    });
  });
});
