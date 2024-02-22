import { useMutation, useQuery } from 'react-query';
import { getUserSettings, postUserSettings } from '../api/settings';
import { fontSizeState, isSettingModalOpen } from '../recoil/recoil';
import { useRecoilState } from 'recoil';

interface IUserSettingType {
  disabilityType: number;
  fontSize: number;
  voiceType: string;
  componentType: string;
}

export const useGetUserSettings = () => {
  const [, setIsOpen] = useRecoilState(isSettingModalOpen);
  useQuery('userSettings', getUserSettings, {
    onSuccess: (data) => {
      if (data.code === 1000 && data.inSuccess) {
        if (data.result) {
          setIsOpen(false);
        } else {
          // 설정이 비어있으면 모달 열기
          setIsOpen(true);
        }
      }
    },
    onError: (error) => {
      console.error("Error fetching user settings:", error);
      setIsOpen(false); // 오류 발생 시 모달 닫기
    }
  });
};

export const usePostUserSettings = () => {
  return useMutation((settings: IUserSettingType) => postUserSettings(settings), {
    onSuccess: (data) => {
      // Check if the response code is 1000
      if (data.code === 1000) {
        // Handle successful update
        console.log('Settings updated successfully:', data);
      } else {
        console.error('Error updating settings: Unexpected response code', data);
      }
    },
    onError: (error) => {
      // Handle error condition
      console.error('Error updating settings:', error);
    },
  });
};