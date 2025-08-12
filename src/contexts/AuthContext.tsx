import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData } from '../types';
import { tokenStorage } from '../lib/auth-storage';

// Auth state interface
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Auth actions
type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string; refreshToken?: string } }
    | { type: 'AUTH_ERROR'; payload: string }
    | { type: 'AUTH_LOGOUT' }
    | { type: 'AUTH_CLEAR_ERROR' }
    | { type: 'AUTH_UPDATE_USER'; payload: User };

// Auth context interface
export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    updateUser: (user: User) => void;
}

// Initial state
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start with loading true to check for existing session
    error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        case 'AUTH_LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'AUTH_CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'AUTH_UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
    children: ReactNode;
}

// Mock API functions (these would be replaced with actual API calls)
const mockLogin = async (credentials: LoginCredentials): Promise<{ user: User; token: string; refreshToken: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        return {
            user: {
                id: '1',
                username: 'testuser',
                email: credentials.email,
                avatar: undefined,
                createdAt: new Date(),
                updatedAt: new Date(),
                statistics: {
                    totalSolved: 0,
                    easySolved: 0,
                    mediumSolved: 0,
                    hardSolved: 0,
                    currentStreak: 0,
                    maxStreak: 0,
                    acceptanceRate: 0,
                    ranking: 0,
                },
            },
            token: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token',
        };
    }
    throw new Error('Invalid credentials');
};

const mockRegister = async (userData: RegisterData): Promise<{ user: User; token: string; refreshToken: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
    }

    return {
        user: {
            id: '2',
            username: userData.username,
            email: userData.email,
            avatar: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            statistics: {
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0,
                currentStreak: 0,
                maxStreak: 0,
                acceptanceRate: 0,
                ranking: 0,
            },
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
    };
};

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing session on mount
    useEffect(() => {
        const checkExistingSession = () => {
            const token = tokenStorage.getToken();
            const userData = tokenStorage.getUserData();

            if (token && userData) {
                dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: {
                        user: userData,
                        token,
                    },
                });
            } else {
                dispatch({ type: 'AUTH_LOGOUT' });
            }
        };

        checkExistingSession();
    }, []);

    // Login function
    const login = async (credentials: LoginCredentials): Promise<void> => {
        dispatch({ type: 'AUTH_START' });

        try {
            const response = await mockLogin(credentials);

            // Store tokens and user data
            tokenStorage.setToken(response.token);
            if (response.refreshToken) {
                tokenStorage.setRefreshToken(response.refreshToken);
            }
            tokenStorage.setUserData(response.user);

            dispatch({
                type: 'AUTH_SUCCESS',
                payload: response,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            dispatch({
                type: 'AUTH_ERROR',
                payload: errorMessage,
            });
            throw error;
        }
    };

    // Register function
    const register = async (userData: RegisterData): Promise<void> => {
        dispatch({ type: 'AUTH_START' });

        try {
            const response = await mockRegister(userData);

            // Store tokens and user data
            tokenStorage.setToken(response.token);
            if (response.refreshToken) {
                tokenStorage.setRefreshToken(response.refreshToken);
            }
            tokenStorage.setUserData(response.user);

            dispatch({
                type: 'AUTH_SUCCESS',
                payload: response,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            dispatch({
                type: 'AUTH_ERROR',
                payload: errorMessage,
            });
            throw error;
        }
    };

    // Logout function
    const logout = (): void => {
        tokenStorage.clearAll();
        dispatch({ type: 'AUTH_LOGOUT' });
    };

    // Clear error function
    const clearError = (): void => {
        dispatch({ type: 'AUTH_CLEAR_ERROR' });
    };

    // Update user function
    const updateUser = (user: User): void => {
        tokenStorage.setUserData(user);
        dispatch({ type: 'AUTH_UPDATE_USER', payload: user });
    };

    const contextValue: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError,
        updateUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}