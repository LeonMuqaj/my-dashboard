/**
 * Modal Component Usage Examples
 *
 * This file demonstrates how to use the reusable Modal component
 * in different scenarios.
 */

import { useState } from "react";
import Modal, {
  ModalContent,
  ModalFooter,
  ModalButton,
} from "@/components/Modal";

// Example 1: Simple Confirmation Modal
function ConfirmationModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Confirmation</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        size="sm"
      >
        <ModalContent>
          <p className="text-gray-700">
            Are you sure you want to proceed with this action?
          </p>
        </ModalContent>
        <ModalFooter>
          <ModalButton onClick={() => setIsOpen(false)} variant="secondary">
            Cancel
          </ModalButton>
          <ModalButton
            onClick={() => {
              // Handle confirmation
              setIsOpen(false);
            }}
            variant="primary"
          >
            Confirm
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}

// Example 2: Form Modal
function FormModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Form</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="User Information"
        size="md"
      >
        <ModalContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <ModalButton onClick={() => setIsOpen(false)} variant="secondary">
            Cancel
          </ModalButton>
          <ModalButton onClick={handleSubmit} variant="primary">
            Submit
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}

// Example 3: Delete Confirmation Modal
function DeleteModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    console.log("Item deleted");
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Delete Item</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Item"
        size="sm"
      >
        <ModalContent>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              {/* Add your icon here */}
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <p className="text-sm text-gray-500">
              This action cannot be undone. Are you sure you want to delete this
              item?
            </p>
          </div>
        </ModalContent>
        <ModalFooter>
          <ModalButton onClick={() => setIsOpen(false)} variant="secondary">
            Cancel
          </ModalButton>
          <ModalButton onClick={handleDelete} variant="danger">
            Delete
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}

// Example 4: Large Content Modal
function LargeContentModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Large Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Terms and Conditions"
        size="lg"
      >
        <ModalContent>
          <div className="space-y-4 text-gray-700">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <p>
              Sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua...
            </p>
            {/* Add more content - it will scroll automatically */}
          </div>
        </ModalContent>
        <ModalFooter>
          <ModalButton onClick={() => setIsOpen(false)} variant="primary">
            I Agree
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}

// Example 5: Modal without close button
function NoCloseButtonModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Important Message"
        size="md"
        showCloseButton={false} // Hides the X button
      >
        <ModalContent>
          <p className="text-gray-700">
            You must choose one of the options below.
          </p>
        </ModalContent>
        <ModalFooter>
          <ModalButton onClick={() => setIsOpen(false)} variant="secondary">
            Option 1
          </ModalButton>
          <ModalButton onClick={() => setIsOpen(false)} variant="primary">
            Option 2
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}

/**
 * Modal Props:
 * - isOpen: boolean - Controls modal visibility
 * - onClose: () => void - Function to call when closing
 * - title: string - Modal header title
 * - size?: "sm" | "md" | "lg" - Modal width (default: "md")
 * - showCloseButton?: boolean - Show/hide X button (default: true)
 * - children: ReactNode - Modal content
 *
 * ModalButton Variants:
 * - "primary" - Blue button (default)
 * - "secondary" - Gray outlined button
 * - "danger" - Red button for destructive actions
 */
