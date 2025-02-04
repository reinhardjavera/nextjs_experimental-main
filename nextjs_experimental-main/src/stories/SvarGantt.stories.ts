import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { SvarGantt } from './SvarGantt';


const meta = {
  title: 'Example/SvarGantt',
  component: SvarGantt,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SvarGantt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gantt1: Story = {
  args: {

  }
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const Gantt2: Story = {
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
