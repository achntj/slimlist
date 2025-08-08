"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";
import { ListWithParsedTags } from "@/lib/types";
import { updateListAction, createListAction } from "@/lib/actions";

interface ListEditorProps {
  list?: ListWithParsedTags;
  onCancel: () => void;
  onSave: () => void;
}

export function ListEditor({ list, onCancel, onSave }: ListEditorProps) {
  const [name, setName] = useState(list?.name || "");
  const [content, setContent] = useState(list?.content || "");
  const [dueDate, setDueDate] = useState(list?.due_date || "");
  const [tags, setTags] = useState(list?.tags.join(", ") || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      if (list) {
        formData.append("id", list.id.toString());
      }
      formData.append("name", name);
      formData.append("content", content);
      formData.append("dueDate", dueDate);
      formData.append("tags", tags);

      if (list) {
        await updateListAction(formData);
      } else {
        await createListAction(formData);
      }
      onSave();
    } catch (error) {
      console.error("Failed to save list:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const placeholderText = `# Project Planning

## Development Tasks
- [ ] **Setup project**
  - [x] ~~Initialize repository~~ ✅
  - [ ] Configure build tools
- [ ] *Design phase*
- [ ] Testing & deployment

## Research Notes
> Important findings from user research

### Key Features
1. User authentication
2. Data visualization
3. Export functionality

| Feature | Priority | Status |
|---------|----------|--------|
| Login | High | ✅ Done |
| Dashboard | High | 🔄 In Progress |
| Reports | Medium | ⏳ Planned |

**Code snippet:**
\`\`\`javascript
const handleSubmit = () => {
  console.log('Form submitted!');
};
\`\`\`

~~Cancelled feature~~ - removed from scope`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {list ? "Edit List" : "Create New List"}
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={!name.trim() || isSaving}
              className="h-8 px-3"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">List Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter list name..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="content">Content (GitHub Flavored Markdown)</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholderText}
            className="mt-1 min-h-[200px] font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">
            Supports checkboxes, tables, ~~strikethrough~~, **bold**, *italic*,
            `code`, and more!
          </p>
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date (optional)</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="work, personal, urgent"
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}
