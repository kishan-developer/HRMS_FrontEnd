import { toast } from 'sonner';

export interface ApiError {
  data?: {
    error?: {
      code?: string;
      message?: string;
    };
    message?: string;
  };
  status?: number;
  error?: string;
  message?: string;
}

export const handleApiError = (error: ApiError | any) => {
  // console.error('API Error:', error);

  let errorMessage = 'An unexpected error occurred';

  // Extract error message from various error formats
  if (error?.data?.error?.message) {
    errorMessage = error.data.error.message;
  } else if (error?.data?.message) {
    errorMessage = error.data.message;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.error) {
    errorMessage = error.error;
  }

  // Handle specific error codes
  if (error?.status === 401) {
    errorMessage = 'Session expired. Please log in again.';
    toast.error(errorMessage, {
      duration: 5000,
    });
    return;
  }

  if (error?.status === 403) {
    errorMessage = 'You do not have permission to perform this action.';
    toast.error(errorMessage, {
      duration: 5000,
    });
    return;
  }

  if (error?.status === 404) {
    errorMessage = 'Resource not found.';
    toast.error(errorMessage, {
      duration: 5000,
    });
    return;
  }

  if (error?.status === 500) {
    errorMessage = 'Server error. Please try again later.';
    toast.error(errorMessage, {
      duration: 5000,
    });
    return;
  }

  // Show error toast for other errors
  toast.error(errorMessage, {
    duration: 5000,
  });
};

export const handleApiSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
  });
};
