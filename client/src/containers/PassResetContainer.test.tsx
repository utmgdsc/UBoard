import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';

import ServerApi from '../api/v1';
import { PassResetContainer } from '.';

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
  render(<PassResetContainer />);
});

describe('password reset', () => {
  describe('on error', () => {
    it('should not reset password if form is missing fields', () => {
      const token = '?r=token123';
      Object.defineProperty(window, 'location', {
        value: {
          search: token,
        },
      });
      expect(window.location.search).toEqual(token);

      const form = screen.getByTestId('form');
      const mockResetPass = jest
        .spyOn(ServerApi.prototype, 'resetPass')
        .mockImplementation();

      fireEvent.submit(form);
      expect(mockResetPass).not.toBeCalled();
    });

    it('should not reset password if fields are invalid', async () => {
      const token = '?r=token123';
      Object.defineProperty(window, 'location', {
        value: {
          search: token,
        },
      });
      expect(window.location.search).toEqual(token);

      const form = screen.getByTestId('form');
      const mockResetPass = jest
        .spyOn(ServerApi.prototype, 'resetPass')
        .mockImplementation();
      const passwordForm = screen.getByTestId('password');

      fireEvent.blur(passwordForm);
      fireEvent.submit(form);

      await new Promise((r) => setTimeout(r, 1));
      expect(mockResetPass).not.toBeCalled();
    });

    it('should not reset pass if token is missing', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
      });
      expect(window.location.search).toBe('');

      // enter input into fields
      const fields = {
        password: 'password',
        confirmPassword: 'password',
      };
      Object.keys(fields).forEach((key) => {
        fireEvent.change(
          screen.getByTestId(key).querySelector('input') as HTMLInputElement,
          { target: { value: fields[key as keyof typeof fields] } }
        );
      });

      const form = screen.getByTestId('form');
      const mockResetPass = jest
        .spyOn(ServerApi.prototype, 'resetPass')
        .mockImplementation(() =>
          Promise.resolve({ status: 204, data: { message: '' } })
        );

      // submit form and test
      await act(async () => {
        fireEvent.submit(form);
        await new Promise((r) => setTimeout(r, 1));
      });
      expect(mockResetPass).not.toBeCalled();
    });
  });

  describe('on success', () => {
    it('should reset pass if fields and token are valid', async () => {
      // set token in url
      const token = '?r=token123';
      Object.defineProperty(window, 'location', {
        value: {
          search: token,
        },
      });
      expect(window.location.search).toEqual(token);

      // enter input into fields
      const fields = {
        password: 'password',
        confirmPassword: 'password',
      };
      Object.keys(fields).forEach((key) => {
        fireEvent.change(
          screen.getByTestId(key).querySelector('input') as HTMLInputElement,
          { target: { value: fields[key as keyof typeof fields] } }
        );
      });

      const form = screen.getByTestId('form');
      const mockResetPass = jest
        .spyOn(ServerApi.prototype, 'resetPass')
        .mockImplementation(() =>
          Promise.resolve({ status: 204, data: { message: '' } })
        );
      const formData = {
        token: 'token123',
        password: 'password',
        confirmPassword: 'password',
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
