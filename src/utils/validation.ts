export interface ValidationErrors {
  min?: string
  max?: string
  duration?: string
  lightHours?: string
}

export function validateProfileSettings(
  min: number,
  max: number,
  duration: number,
  lightHours: number = 12,
): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {}

  if (isNaN(min) || min < 0 || min > 95) {
    errors.min = 'Minimum moisture must be between 0% and 95%'
  }

  if (isNaN(max) || max < 5 || max > 100) {
    errors.max = 'Maximum moisture must be between 5% and 100%'
  }

  if (!errors.min && !errors.max && min >= max) {
    errors.min = 'Minimum moisture must be strictly less than maximum'
  } else if (!errors.min && !errors.max && max - min < 5) {
    errors.max = 'Separation between Min and Max must be at least 5%'
  }

  if (isNaN(duration) || duration < 1 || duration > 10) {
    errors.duration = 'Watering pulse must be between 1 and 10 seconds (firmware safety limit)'
  } else if (!Number.isInteger(duration)) {
    errors.duration = 'Watering duration must be a whole number of seconds'
  }

  if (isNaN(lightHours) || lightHours < 1 || lightHours > 24) {
    errors.lightHours = 'Grow light photoperiod must be between 1 and 24 hours'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
