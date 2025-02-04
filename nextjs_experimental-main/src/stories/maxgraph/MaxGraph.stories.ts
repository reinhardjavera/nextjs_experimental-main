import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { MaxGraph } from './MaxGraph';


const meta = {
  title: 'Example/MaxGraph',
  component: MaxGraph,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MaxGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    mode: "basic"
  }
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const Codec: Story = {
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
  args: {
    mode: "codec"
  }
};

export const Editor: Story = {
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
  args: {
    mode: "editor"
  }
};