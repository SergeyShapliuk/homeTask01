import { VideoInputDto } from '../dto/video.input-dto';
import { ValidationError } from '../types/validationError';
import { Resolution, VALID_RESOLUTIONS } from '../types/video';

export const inputDtoValidation = (data: VideoInputDto): ValidationError[] => {
  const { title, author, availableResolutions } = data;
  const errors: ValidationError[] = [];

  // --- Проверка title ---
  if (typeof title !== 'string') {
    errors.push({
      message: 'Title is required and must be a string',
      field: 'title',
    });
  } else {
    const trimmedTitle: string = (title as string).trim();
    if (trimmedTitle.length === 0) {
      errors.push({ message: 'Title cannot be empty', field: 'title' });
    } else if (trimmedTitle.length > 40) {
      errors.push({
        message: 'Title must be less than 40 characters',
        field: 'title',
      });
    }
  }

  // --- Проверка author ---
  if (typeof author !== 'string') {
    errors.push({
      message: 'Author is required and must be a string',
      field: 'author',
    });
  } else {
    const trimmedAuthor: string = (author as string).trim();
    if (trimmedAuthor.length === 0) {
      errors.push({ message: 'Author cannot be empty', field: 'author' });
    } else if (trimmedAuthor.length > 20) {
      errors.push({
        message: 'Author must be less than 20 characters',
        field: 'author',
      });
    }
  }

  // --- Проверка availableResolutions ---
  if (availableResolutions === undefined || availableResolutions === null) {
    errors.push({
      message: 'AvailableResolutions is required',
      field: 'availableResolutions',
    });
  } else if (!Array.isArray(availableResolutions)) {
    errors.push({
      message: 'AvailableResolutions must be an array',
      field: 'availableResolutions',
    });
  } else if (availableResolutions.length === 0) {
    errors.push({
      message: 'At least one resolution is required',
      field: 'availableResolutions',
    });
  } else {
    for (const resolution of availableResolutions) {
      if (typeof resolution !== 'string') {
        errors.push({
          message: 'Each resolution must be a string',
          field: 'availableResolutions',
        });
        break;
      }
      const resolutionTyped = resolution as Resolution;
      if (!VALID_RESOLUTIONS.includes(resolutionTyped)) {
        errors.push({
          message: `Invalid resolution: ${resolution}. Allowed: ${VALID_RESOLUTIONS.join(', ')}`,
          field: 'availableResolutions',
        });
        break;
      }
    }
  }
  return errors;
};
