import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Select } from "@chakra-ui/select";
import { ReactElement, useEffect, useState } from "react";
import { LocalStorageKey } from "../../utils/constant";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
}: Props): ReactElement {
  const [vidDevices, setVidDevices] = useState<MediaDeviceInfo[]>([]);
  const [audDevices, setAudDevices] = useState<MediaDeviceInfo[]>([]);
  const [vidID, setVidID] = useState<string | undefined>(
    localStorage.getItem(LocalStorageKey.vidId) || undefined
  );
  const [micID, setMicID] = useState<string | undefined>(
    localStorage.getItem(LocalStorageKey.micId) || undefined
  );

  const selectVidID = (vidID: string) => {
    setVidID(vidID);
  };

  const selectMicID = (micID: string) => {
    setMicID(micID);
  };

  const onSave = () => {
    localStorage.setItem(LocalStorageKey.vidId, vidID);
    localStorage.setItem(LocalStorageKey.micId, micID);
    onClose();
  };

  useEffect(() => {
    getCam();
  }, []);

  async function getCam() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    for (const device of devices) {
      if (device.kind === "videoinput") {
        setVidDevices((vidDevices) => [...vidDevices, device]);
      }
      if (device.kind === "audioinput") {
        setAudDevices((audDevices) => [...audDevices, device]);
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
      <ModalContent>
        <ModalHeader>Device settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select value={vidID} onChange={(e) => selectVidID(e.target.value)}>
            {vidDevices.map((vidDevice) => {
              return (
                <option key={vidDevice.deviceId} value={vidDevice.deviceId}>
                  {vidDevice.label}
                </option>
              );
            })}
          </Select>
          <Select
            margin="20px 0px 0px 0px"
            value={micID}
            onChange={(e) => selectMicID(e.target.value)}
            placeholder="Select Audio Device"
          >
            {audDevices.map((audDevice) => {
              return (
                <option key={audDevice.deviceId} value={audDevice.deviceId}>
                  {audDevice.label}
                </option>
              );
            })}
          </Select>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="orange" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} colorScheme="green">
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
