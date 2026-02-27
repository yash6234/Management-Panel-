import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { Modal, TextInput, Button, Stack, Select } from '@mantine/core';
import { useApp } from '../../context/AppContext';

function toDateOnly(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return format(d, 'yyyy-MM-dd');
}

export default function SalesEntryModal({ open, onClose, onSave, selectedDate }) {
  const { persons } = useApp();
  const personOptions = [
    { value: '', label: '— Select person (optional) —' },
    ...persons.map((p) => ({ value: p.id, label: p.name || p.id })),
  ];

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      date: toDateOnly(new Date()),
      salesOfProducts: '',
      deposit: '',
      credit: '',
      location: '',
    },
  });

  useEffect(() => {
    if (open) {
      clearErrors();
      const dateStr = selectedDate ? toDateOnly(selectedDate) : toDateOnly(new Date());
      reset({
        name: '',
        date: dateStr,
        salesOfProducts: '',
        deposit: '',
        credit: '',
        location: '',
      });
    }
  }, [open, selectedDate, reset, clearErrors]);

  const onSubmit = (data) => {
    if (!data.date?.trim()) {
      setError('date', { message: 'Date is required' });
      return;
    }
    if (!data.salesOfProducts?.trim()) {
      setError('salesOfProducts', { message: 'Sales of Products is required' });
      return;
    }
    if (!data.deposit?.trim()) {
      setError('deposit', { message: 'Deposit is required' });
      return;
    }
    const person = persons.find((p) => p.id === data.name);
    onSave({
      name: person?.name ?? data.name ?? '',
      personId: data.name || null,
      date: data.date,
      salesOfProducts: data.salesOfProducts.trim(),
      deposit: data.deposit.trim(),
      credit: (data.credit || '').trim(),
      location: (data.location || '').trim(),
    });
    reset();
    onClose();
  };

  return (
    <Modal
      opened={!!open}
      onClose={onClose}
      title="Add Sales Entry"
      centered
      radius="md"
      styles={{
        header: { borderBottom: '1px solid #E5E7EB' },
        content: { maxWidth: 420 },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Select
                label="Person"
                placeholder="Select person (optional)"
                data={personOptions}
                value={field.value}
                onChange={field.onChange}
                clearable
                searchable
                styles={{ input: { borderRadius: '8px' } }}
              />
            )}
          />
          <TextInput
            label="Date"
            type="date"
            required
            {...register('date')}
            error={errors.date?.message}
            styles={{ input: { borderRadius: '8px' } }}
          />
          <TextInput
            label="Sales of Products"
            placeholder="Sales of products"
            required
            {...register('salesOfProducts')}
            error={errors.salesOfProducts?.message}
            styles={{ input: { borderRadius: '8px' } }}
          />
          <TextInput
            label="Deposit"
            placeholder="Deposit"
            required
            {...register('deposit')}
            error={errors.deposit?.message}
            styles={{ input: { borderRadius: '8px' } }}
          />
          <TextInput
            label="Credit"
            placeholder="Credit"
            {...register('credit')}
            styles={{ input: { borderRadius: '8px' } }}
          />
          <TextInput
            label="Location"
            placeholder="Location"
            {...register('location')}
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
