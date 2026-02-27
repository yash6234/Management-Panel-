import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Modal, TextInput, NumberInput, Button, Stack } from '@mantine/core';

export default function CommissionLabourModal({ open, onClose, onSave, editing }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', amount: 0 },
  });

  useEffect(() => {
    if (open) {
      clearErrors();
      reset(editing ? { name: editing.name, amount: editing.amount ?? 0 } : { name: '', amount: 0 });
    }
  }, [open, editing, reset, clearErrors]);

  const onSubmit = (data) => {
    if (!data.name?.trim()) {
      setError('name', { message: 'Name is required' });
      return;
    }
    const amount = Number(data.amount);
    if (isNaN(amount) || amount < 0) {
      setError('amount', { message: 'Enter a valid amount' });
      return;
    }
    onSave({ name: data.name.trim(), amount });
    reset();
    onClose();
  };

  return (
    <Modal
      opened={!!open}
      onClose={onClose}
      title={editing ? 'Edit Commission/Labour' : 'Add Commission/Labour'}
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
            placeholder="Name"
            required
            {...register('name')}
            error={errors.name?.message}
            styles={{ input: { borderRadius: '8px' } }}
          />
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Amount"
                placeholder="Amount"
                min={0}
                step={0.01}
                value={field.value}
                onChange={field.onChange}
                error={errors.amount?.message}
                styles={{ input: { borderRadius: '8px' } }}
              />
            )}
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
