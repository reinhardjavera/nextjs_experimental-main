import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Input } from './Input';

const meta = {
  title: 'Example/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: { 
      control: 'select', 
      options: ['text', 'number', 'file', 'color', 'email', 'date'] 
    },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    onChange: { action: 'changed' },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story untuk input teks
export const Text: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
};

// Story untuk input angka
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number...',
  },
};

// Story untuk input file
export const File: Story = {
  args: {
    type: 'file',
  },
};

// Story untuk input warna
export const Color: Story = {
  args: {
    type: 'color',
    value: '#ff0000', // Warna default
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`Selected color: ${event.target.value}`);
    },
  },
};

// Story untuk input email
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email...',
  },
};

// Story untuk input tanggal
export const Date: Story = {
  args: {
    type: 'date',
  },
};
