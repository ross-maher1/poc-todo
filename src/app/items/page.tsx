"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2 } from "lucide-react";

import { Item } from "@/lib/types";
import { createId } from "@/lib/utils";
import { loadItems, saveItems } from "@/lib/storage/itemStorage";
import ListRow from "@/components/ui/ListRow";

/**
 * Form validation schema.
 * Customize this for your app's item fields.
 */
const itemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

/**
 * Items list page with CRUD form.
 *
 * This is a template - customize it for your app.
 */
export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Load data on mount
  useEffect(() => {
    const data = loadItems();
    setItems(data);
    setLoading(false);
  }, []);

  // Derived state
  const formTitle = useMemo(
    () => (editingId ? "Edit item" : "Add an item"),
    [editingId]
  );

  // Form submission
  const onSubmit = (values: ItemFormValues) => {
    const payload: Item = {
      id: editingId || createId(),
      title: values.title,
      description: values.description,
      createdAt: editingId
        ? items.find((i) => i.id === editingId)?.createdAt ||
          new Date().toISOString()
        : new Date().toISOString(),
    };

    let updated: Item[];
    if (editingId) {
      updated = items.map((item) => (item.id === editingId ? payload : item));
    } else {
      updated = [payload, ...items];
    }

    setItems(updated);
    saveItems(updated);
    reset();
    setEditingId(null);
  };

  // Start editing an item
  const startEditing = (item: Item) => {
    setEditingId(item.id);
    reset({
      title: item.title,
      description: item.description,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    reset();
  };

  // Delete an item
  const deleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveItems(updated);
    if (editingId === id) {
      setEditingId(null);
      reset();
    }
  };

  return (
    <main className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="type-meta">Collection</p>
          <h1 className="type-h1">Items</h1>
          <p className="type-lead">Manage your items here.</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{formTitle}</h2>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline"
              >
                Cancel edit
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                {...register("title")}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                placeholder="Item title"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                {...register("description")}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                placeholder="Item description"
                rows={3}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
              >
                {editingId ? "Save changes" : "Add item"}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Saved items</h2>
            <span className="text-xs text-slate-500">{items.length} total</span>
          </div>
          {loading ? (
            <p className="mt-4 type-lead">Loading...</p>
          ) : items.length === 0 ? (
            <p className="mt-4 type-lead">
              No items yet. Add one to get started.
            </p>
          ) : (
            <div className="mt-4 rounded-xl border border-slate-100 bg-white px-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="flex-grow">
                    <ListRow
                      title={item.title}
                      subtitle={item.description || "No description"}
                      onClick={() => startEditing(item)}
                    />
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
