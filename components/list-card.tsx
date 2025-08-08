"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar } from "lucide-react";
import { ListWithParsedTags } from "@/lib/types";
import { deleteListAction } from "@/lib/actions";
import { ListEditor } from "./list-editor";
import ReactMarkdown from "react-markdown";

interface ListCardProps {
  list: ListWithParsedTags;
  onUpdate: () => void;
}

export function ListCard({ list, onUpdate }: ListCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this list?")) return;

    setIsDeleting(true);
    try {
      await deleteListAction(list.id);
      onUpdate();
    } catch (error) {
      console.error("Failed to delete list:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""}`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  if (isEditing) {
    return (
      <ListEditor
        list={list}
        onCancel={() => setIsEditing(false)}
        onSave={() => {
          setIsEditing(false);
          onUpdate();
        }}
      />
    );
  }

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {list.name}
            </h3>
            {list.due_date && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span
                  className={`${
                    new Date(list.due_date) < new Date()
                      ? "text-red-600 font-medium"
                      : new Date(list.due_date).toDateString() ===
                          new Date().toDateString()
                        ? "text-orange-600 font-medium"
                        : "text-slate-600"
                  }`}
                >
                  {formatDate(list.due_date)}
                </span>
              </div>
            )}
          </div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {list.content && (
          <div className="prose prose-sm max-w-none mb-4">
            <ReactMarkdown
              components={{
                ul: ({ children }) => (
                  <ul className="list-none space-y-1 pl-0">{children}</ul>
                ),
                li: ({ children }) => {
                  const content = children?.toString() || "";
                  if (content.includes("[ ]") || content.includes("[x]")) {
                    const isChecked = content.includes("[x]");
                    const text = content.replace(/^\s*-\s*\[([ x])\]\s*/, "");
                    return (
                      <li className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mt-1 rounded border-slate-300"
                        />
                        <span
                          className={
                            isChecked ? "line-through text-slate-500" : ""
                          }
                        >
                          {text}
                        </span>
                      </li>
                    );
                  }
                  return <li>{children}</li>;
                },
              }}
            >
              {list.content}
            </ReactMarkdown>
          </div>
        )}
        {list.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {list.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
