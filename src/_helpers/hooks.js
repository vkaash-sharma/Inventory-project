import { useCallback, useState } from "react";

export function useForm(initialForm = {}, fields) {
  const [form, setForm] = useState(() => initialForm);

  const onChange = useCallback(
    (e) => {
      const event = { ...e };
      const { name, value, type, checked, files } = event.target;

      setForm((prev) => {
        const field = fields?.find(
          (f) => (f.selectorForm || f.selector) === name
        );
        const extraToChange = field?.extraToChange?.(prev, event) || {};

        const newForm = {
          ...prev,
          [name]:
            type === "checkbox" ? checked : type === "file" ? files[0] : value,
          ...extraToChange,
        };

        // "prev[name] !== value" Because Selected option could be the same as Previous, so No Need to reset!
        if (prev[name] !== value && field?.dependencies)
          field.dependencies.forEach((f) => {
            if (f.selector) newForm[f.selector] = "";
            if (f.selectorForm) newForm[f.selectorForm] = "";
          });

        return newForm;
      });
    },
    [fields]
  );

  return [form, onChange, setForm];
}
