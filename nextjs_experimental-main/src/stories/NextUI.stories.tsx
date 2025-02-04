import type { Meta, StoryObj } from '@storybook/react';
import FormTemplate from './NextUI';

const meta = {
  title: 'Example/NextUI',
  component: FormTemplate,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    submitBgColor: { control: 'color' },
    submitTextSize: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    showForm: { control: 'boolean' },
    showDrawer: { control: 'boolean' },
  },
  args: {
    submitBgColor: '#0070f3',
    submitTextSize: 'medium',
    showForm: true,  // Default to show Form
    showDrawer: false, // Default to hide Drawer
  },
} satisfies Meta<typeof FormTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Form: Story = {
  args: {
    showForm: true,
    showDrawer: false,
  }
};

export const Drawer: Story = {
  args: {
    showForm: false,
    showDrawer: true,
  }
};
