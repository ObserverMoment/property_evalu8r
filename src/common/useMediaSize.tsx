import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { DeviceSize } from "../types/types";
import { MEDIA_SIZES } from "../components/styled/theme";

export const MediaSizeContext = createContext<DeviceSize>("small");

export const MediaSizeProvider = ({ children }: PropsWithChildren) => {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("small");

  const updateMedia = () => {
    setDeviceSize(
      window.innerWidth > MEDIA_SIZES.desktop
        ? "large"
        : window.innerWidth > MEDIA_SIZES.tablet
        ? "medium"
        : "small"
    );
  };

  useEffect(() => {
    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  return (
    <MediaSizeContext.Provider value={deviceSize}>
      {children}
    </MediaSizeContext.Provider>
  );
};

export const useMediaSize = () => useContext(MediaSizeContext);
