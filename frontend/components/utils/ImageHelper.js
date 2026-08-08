import { API_URL } from '../../config/api';

export const getValidImageUrl = (dbImageUrl) => {
    if (!dbImageUrl) return null;

    if (typeof dbImageUrl === 'string') {
        // If the string contains our uploads folder, extract just the filename
        // This rescues old database entries that have broken IP addresses hardcoded!
        if (dbImageUrl.includes('/uploads/')) {
            const filename = dbImageUrl.split('/uploads/')[1];
            return `${API_URL}/uploads/${filename}`;
        }
        return dbImageUrl;
    }
    
    return null;
};