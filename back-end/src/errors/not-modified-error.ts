
import { ApplicationError } from '@/protocols';

export function notModifiedError(): ApplicationError {
  return {
    name: 'NotModified',
    message: 'You already has this plan',
  };
}
