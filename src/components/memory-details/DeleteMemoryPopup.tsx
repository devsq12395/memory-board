import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Popup from "../common/Popup";
import Button from "../common/Button";
import ConfirmationPopup from "../common/ConfirmationPopup";

import { usePopups } from "../contexts/PopupsContext";
import { useProfilePage } from "../contexts/ProfilePageContext";

import { deleteMemory } from "../../services/memoryService";

const DeleteMemoryPopup: React.FC = () => {
  const navigate = useNavigate();

  const popupsContext = usePopups();
  const profilePageContext = useProfilePage();
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [isDeleteFailurePopupOpen, setIsDeleteFailurePopupOpen] = useState(false);

  const buttonClicks = async (buttonType: string) => {  
    switch (buttonType) {
      case 'cancel':
        closePopup();
        break;
      case 'delete':
        if (!popupsContext.curMemoryId) return;

        try {
          await deleteMemory(popupsContext.curMemoryId);
          setIsConfirmationPopupOpen(true);
        } catch (error) {
          console.error('Error deleting memory:', error);
          setIsDeleteFailurePopupOpen(true);
          return;
        }

        closePopup();
        break;
      default:
        break;
    }
  };

  const closePopup = () => {
    popupsContext.setIsDeleteMemoryPopupOpen(false);
  };

  const closeConfirmationPopup = () => {
    setIsConfirmationPopupOpen(false);
    navigate(`${profilePageContext.pageUsername ? `/${profilePageContext.pageUsername}` : '/'}`);
    window.location.reload();
  };

  return <>
    <Popup isShow={popupsContext.isDeleteMemoryPopupOpen} titleText="Delete Memory" onClose={() => closePopup()}>
      <div className="flex flex-col items-center">
        <p className="text-center text-4xl font-bold">Are you sure you want to delete this memory?</p>
        <p className="text-center text-2xl font-bold">This action cannot be undone.</p>
        <div className="flex gap-4 mt-4">
          <Button type="button" text="Cancel" onClick={() => buttonClicks('cancel')} />
          <Button type="button" text="Delete" onClick={() => buttonClicks('delete')} />
        </div>
      </div>
    </Popup>

    <ConfirmationPopup isShow={isConfirmationPopupOpen} title="Memory Deleted" onClose={closeConfirmationPopup} />
    <ConfirmationPopup isShow={isDeleteFailurePopupOpen} title="Memory Deletion Failed" onClose={() => setIsDeleteFailurePopupOpen(false)} />
  </>
};

export default DeleteMemoryPopup;