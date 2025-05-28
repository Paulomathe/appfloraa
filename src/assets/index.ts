// Arquivo de índice para facilitar a importação de imagens

// Ícones do aplicativo
export const icons = {
  icon: require('../../assets/images/icon.png'),
  favicon: require('../../assets/images/favicon.png'),
  adaptiveIcon: require('../../assets/images/adaptive-icon.png'),
  splash: require('../../assets/images/splash-icon.png'),
};

// Imagens de perfil
export const profileImages = {
  default: require('./images/profile-default.png'),
};

// Função para obter o ícone de perfil com fallback
export const getProfileImage = (url?: string | null) => {
  if (url) {
    return { uri: url };
  }
  return profileImages.default;
};

export default {
  icons,
  profileImages,
  getProfileImage,
};