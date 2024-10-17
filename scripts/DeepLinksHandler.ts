import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect } from 'react';

const handleDeepLink = (event:any) => {
  const url = event.url;
  const data = Linking.parse(url);
  if (data) {
    router.replace({ pathname: '/(screens)/profilescreen', params: { userId: data.path } });
  }
};

const DeepLinkHandler = () => {
  useEffect(() => {
    const linkingListener = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });
    return () => {
      linkingListener.remove();
    };
  }, [handleDeepLink]);

  return null;
};

export default DeepLinkHandler;