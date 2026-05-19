"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateDeckAction, deleteDeckAction } from "@/actions/decks";
import type { SelectDeck } from "@/schema";

type State = { error?: string } | null;

export function EditDeckDialog({ deck }: { deck: SelectDeck }) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function editAction(_prev: State, formData: FormData): Promise<State> {
    try {
      await updateDeckAction({
        deckId: deck.id,
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || undefined,
      });
      return null;
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Something went wrong" };
    }
  }

  async function handleDelete() {
    try {
      await deleteDeckAction({ deckId: deck.id });
      setOpen(false);
    } catch {
      // errors surface via the form state
    }
  }

  const [state, formAction, pending] = useActionState(editAction, null);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setConfirmDelete(false);
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit deck"
            onClick={(e) => e.preventDefault()}
          />
        }
      >
        <Pencil className="size-3.5" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Deck</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await formAction(formData);
            setOpen(false);
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor={`deck-title-${deck.id}`}>Title</Label>
            <Input
              id={`deck-title-${deck.id}`}
              name="title"
              defaultValue={deck.title}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`deck-description-${deck.id}`}>Description</Label>
            <Input
              id={`deck-description-${deck.id}`}
              name="description"
              defaultValue={deck.description ?? ""}
              placeholder="Optional description"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-destructive">Delete this deck?</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  Confirm
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Deck
              </Button>
            )}
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
