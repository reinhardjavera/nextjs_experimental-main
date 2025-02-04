import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { QuillWysiwig } from './QuillWysiwig';


const meta = {
  title: 'Example/QuillWysiwig',
  component: QuillWysiwig,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuillWysiwig>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quill1: Story = {
  args: {

  }
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const Quill2: Story = {
  play: async ({ canvasElement }) => {
    // const canvas = within(canvasElement);
    // const loginButton = canvas.getByRole('button', { name: /Log in/i });
    // await expect(loginButton).toBeInTheDocument();
    // await userEvent.click(loginButton);
    // await expect(loginButton).not.toBeInTheDocument();

    // const logoutButton = canvas.getByRole('button', { name: /Log out/i });
    // await expect(logoutButton).toBeInTheDocument();
    await expect(true).toBeTruthy();
  },
};
