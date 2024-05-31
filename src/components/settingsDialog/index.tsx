"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LucideSettings } from "lucide-react";
import { checkIfApiKeyExists, getApiKey, setApiKey } from "@/lib/apiKey";

const API_KEY_NAME = "perigon-api-key";

export default function SettingsDialog() {
  const isApiKeyExists = checkIfApiKeyExists();

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const apiKeyValue = formData.get("apiKey")?.toString();

    if (apiKeyValue) {
      setApiKey(apiKeyValue);
    }
  }

  return (
    <Dialog defaultOpen={!isApiKeyExists}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <LucideSettings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={saveSettings}>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Enter your Perigon API key to connect your account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="api-key" className="text-right">
                API Key
              </Label>
              <Input
                name="apiKey"
                id="api-key"
                placeholder="Enter your API key"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button type="submit">Save</Button>
            </DialogClose>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
