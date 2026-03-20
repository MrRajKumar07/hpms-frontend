import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message }) => (
  <Modal isOpen={isOpen} onClose={onCancel}>
    <p>{message}</p>
    <Button onClick={onConfirm}>Confirm</Button>
    <Button onClick={onCancel} variant="secondary">Cancel</Button>
  </Modal>
);