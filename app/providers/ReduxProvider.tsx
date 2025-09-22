'use client';

/**
 * ALEXIKA Redux Provider
 * 
 * Client-side Redux Provider component for managing global application state.
 * Wraps the app with Redux store and provides state management capabilities.
 */

import { Provider } from 'react-redux';
import { store } from '../../store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default ReduxProvider;