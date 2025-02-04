import React from "react";
import './assets/index.css';
import {
  Form,
  Input,
  Checkbox,
  Button,
} from "@nextui-org/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@nextui-org/react";

export interface FormTemplateProps {
  submitBgColor?: string;
  submitTextSize?: 'small' | 'medium' | 'large';
  showForm?: boolean;
  showDrawer?: boolean;
  placementDrawer?: 'top' | 'right' | 'bottom' | 'left';
}

export default function FormTemplate({
  submitBgColor = '#0070f3',
  submitTextSize = 'medium',
  showForm = true,
  showDrawer = false,
  placementDrawer = 'left',
}: FormTemplateProps) {
  const [password, setPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState(null);
  const [errors, setErrors] = React.useState({} as {terms?: string, name?: string});
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [selectedColor, setSelectedColor] = React.useState("#0070f3");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const getPasswordError = (value: string) => {
    if (value.length < 4) {
      return "Password must be 4 characters or more";
    }
    if ((value.match(/[A-Z]/g) || []).length < 1) {
      return "Password needs at least 1 uppercase letter";
    }
    if ((value.match(/[^a-z]/gi) || []).length < 1) {
      return "Password needs at least 1 symbol";
    }
    return null;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const newErrors: Record<string, string> = {};
    const passwordError = getPasswordError(data.password as string);

    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (data.name === "admin") {
      newErrors.name = "Nice try! Choose a different username";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (data.terms !== "true") {
      setErrors({ terms: "Please accept the terms" });
      return;
    }

    setErrors({});
    setSubmitted(data as any);
  };

  return (
    <>
      {/* Render Form Only if showForm is true */}
      {showForm && (
        <Form
          className="w-full justify-center items-center space-y-4"
          validationBehavior="native"
          validationErrors={errors}
          onReset={() => {
            setSubmitted(null);
            setSelectedFile(null);
            setSelectedColor("#0070f3");
          }}
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-4 max-w-md">
            <Input
              isRequired
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return "Please enter your name";
                }
                return errors.name;
              }}
              label="Name"
              labelPlacement="outside"
              name="name"
              placeholder="Enter your name"
            />

            <Input
              isRequired
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return "Please enter your email";
                }
                if (validationDetails.typeMismatch) {
                  return "Please enter a valid email address";
                }
              }}
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="email"
            />

            <Input
              isRequired
              errorMessage={getPasswordError(password)}
              isInvalid={getPasswordError(password) !== null}
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onValueChange={setPassword}
            />

            <div>
              <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">
                Upload File
              </label>
              <input
                id="file-input"
                type="file"
                className="mt-1 block w-full text-sm text-gray-500"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                }}
              />
            </div>

            <div>
              <label htmlFor="color-input" className="block text-sm font-medium text-gray-700">
                Select Color
              </label>
              <input
                id="color-input"
                type="color"
                className="mt-1 block w-20 h-10 border-none rounded"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
              <span className="text-small text-default-500 mt-1">
                Selected Color: {selectedColor}
              </span>
            </div>

            <Checkbox
              isRequired
              classNames={{
                label: "text-small",
              }}
              isInvalid={!!errors.terms}
              name="terms"
              validationBehavior="aria"
              value="true"
              onValueChange={() => setErrors((prev) => ({ ...prev, terms: undefined }))}
            >
              I agree to the terms and conditions
            </Checkbox>

            {errors.terms && <span className="text-danger text-small">{errors.terms}</span>}

            <div className="flex gap-4">
              <Button
                className="w-full"
                color="primary"
                type="submit"
                style={{
                  backgroundColor: submitBgColor,
                  fontSize:
                    submitTextSize === 'small'
                      ? '12px'
                      : submitTextSize === 'large'
                        ? '18px'
                        : '14px',
                }}
              >
                Submit
              </Button>
              <Button type="reset" variant="bordered">
                Reset
              </Button>
            </div>
          </div>

          {submitted && (
            <div className="text-small text-default-500 mt-4">
              Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
            </div>
          )}
        </Form>
      )}

      {/* Render Drawer Only if showDrawer is true */}
      {showDrawer && (
        <div className="mt-6">
          <Button onPress={onOpen} className="capitalize w-full">
            Open Drawer
          </Button>
          <Drawer isOpen={isOpen} placement={placementDrawer} onOpenChange={onOpenChange}>
            <DrawerContent>
              {(onClose: any) => (
                <>
                  <DrawerHeader className="flex flex-col gap-1 border-y-1 border-black ">App</DrawerHeader>
                  <DrawerBody>
                    <ul className="space-y-2">
                      {["Menu 1", "Menu 2", "Menu 3", "Menu 4", "Menu 5"].map((menu, index) => (
                        <li key={index} className="text-gray-700 hover:text-gray-900">
                          {menu}
                        </li>
                      ))}
                    </ul>
                  </DrawerBody>
                  <DrawerFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </DrawerFooter>
                </>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </>
  );
}
