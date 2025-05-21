
export const GEMINI_API_MODEL = 'gemini-2.5-flash-preview-04-17';

export const EMOTION_ANALYSIS_PROMPT = `Analyze the facial expression in this image and identify the primary emotion being displayed by the person. 
Respond with only the name of the emotion (e.g., Happy, Sad, Angry, Surprised, Disgusted, Fearful, Neutral). 
If no clear face or emotion is discernible, respond with "Could not determine emotion" or "No clear face detected".`;

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
