"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { createDeck } from "@/actions/decks";

type State = { error?: string } | null;

async function createDeckAction(
  _prev: State,
  formData: FormData
): Promise<State> {
  try {
    await createDeck({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
    });
    return null;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong" };
  }
}

export function CreateDeckDialog({ limitReached = false }: { limitReached?: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createDeckAction, null);

  if (limitReached) {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-muted-foreground">
          You&apos;ve reached the 3-deck limit on the free plan.
        </p>
        <Link href="/pricing" className={buttonVariants()}>
          <Plus />
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
      }}
    >
      <DialogTrigger render={<Button />}>
        <Plus />
        Create New Deck
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Deck</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await formAction(formData);
            setOpen(false);
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Spanish Vocabulary"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Optional description"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create Deck"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
