import Iconsearch from '@/assets/images/icon-search.svg?react';
import { Field, FieldLabel } from '@/components/ui/field.tsx';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group.tsx';

function SearchInput() {
  return (
    <Field>
      <FieldLabel htmlFor="input-group-url" className="sr-only">
        Search currencies
      </FieldLabel>
      <InputGroup className="h-11.5">
        <InputGroupInput
          id="input-group-url"
          placeholder="Search currencies..."
          className="text-preset-5"
        />
        <InputGroupAddon align="inline-start">
          <Iconsearch />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

export { SearchInput };
