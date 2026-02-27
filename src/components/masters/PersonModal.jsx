import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, TextInput, Textarea, Button, Stack } from '@mantine/core';

export default function PersonModal({ open, onClose, onSave, editing }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', mobile: '', email: '', address: '' },
  });

  useEffect(() => {
    if (open) {
      clearErrors();
      reset(
        editing
          ? {
              name: editing.name,
              mobile: editing.mobile || '',
              email: editing.email || '',
              address: editing.address || '',
            }
          : { name: '', mobile: '', email: '', address: '' }
      );
    }
  }, [open, editing, reset, clearErrors]);

  const onSubmit = (data) => {
    if (!data.name?.trim()) {
      setError('name', { message: 'Name is required' });
      return;
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError('email', { message: 'Invalid email' });
      return;
    }
    onSave(data);
    reset();
    onClose();
  };

  return (
    <Modal
      opened={!!open}
      onClose={onClose}
      title={editing ? 'Edit Person' : 'Add Person'}
      centered
      radius="md"
      styles={{
        header: { borderBottom: '1px solid #E5E7EB' },
        content: { maxWidth: 420 },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="Full name"
            required
            {...register('name')}
            error={errors.name?.message}
            styles={{ input: { borderRadius: '8px' } }}
          />
          <TextInput
            label="M.no"
            placeholder="Mobile number"
            {...register('mobile')}
            styles={{ input: { borderRadius: '8px' } }}
          />
          <TextInput
            label="Email"
            placeholder="Email address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            styles={{ input: { borderRadius: '8px' } }}
          />
          <Textarea
            label="Address"
            placeholder="Address"
            rows={3}
            {...register('address')}
            styles={{ input: { borderRadius: '8px' } }}
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="default"
              fullWidth
              onClick={onClose}
              className="border-[#E5E7EB]"
            >
              Cancel
            </Button>
            <Button fullWidth type="submit" color="teal">
              Save
            </Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
}
