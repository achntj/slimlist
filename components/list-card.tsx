"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar } from "lucide-react";
import { ListWithParsedTags } from "@/lib/types";
import { deleteListAction, updateListAction } from "@/lib/actions";
import { ListEditor } from "./list-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface ListCardProps {
  list: ListWithParsedTags;
  onUpdate: () => void;
}

export function ListCard({ list, onUpdate }: ListCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [content, setContent] = useState(list.content);

  // Update content when list prop changes
  useEffect(() => {
    setContent(list.content);
  }, [list.content]);

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

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checkbox = event.target;
    const isChecked = checkbox.checked;

    // Get the text content of the list item that contains this checkbox
    const listItem = checkbox.closest("li");
    if (!listItem) return;

    // Get the text content of the list item (excluding nested lists)
    const textContent = Array.from(listItem.childNodes)
      .filter(
        (node) =>
          node.nodeType === Node.TEXT_NODE ||
          (node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName !== "UL" &&
            node.nodeName !== "OL"),
      )
      .map((node) => node.textContent)
      .join("")
      .trim();

    // Find the line in the content that matches this text
    const lines = content.split("\n");
    let targetLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (
        (line.includes("- [ ]") || line.includes("- [x]")) &&
        line.includes(textContent.replace(/^\s*/, ""))
      ) {
        targetLineIndex = i;
        break;
      }
    }

    if (targetLineIndex === -1) {
      // Fallback: find by checkbox state and similar text
      const searchText = textContent.substring(0, 20); // First 20 chars
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
          (line.includes("- [ ]") || line.includes("- [x]")) &&
          line.toLowerCase().includes(searchText.toLowerCase())
        ) {
          targetLineIndex = i;
          break;
        }
      }
    }

    if (targetLineIndex !== -1) {
      // Update the specific line
      if (isChecked) {
        lines[targetLineIndex] = lines[targetLineIndex].replace(
          "- [ ]",
          "- [x]",
        );
      } else {
        lines[targetLineIndex] = lines[targetLineIndex].replace(
          "- [x]",
          "- [ ]",
        );
      }

      const updatedContent = lines.join("\n");
      setContent(updatedContent);

      // Update in database
      try {
        const formData = new FormData();
        formData.append("id", list.id.toString());
        formData.append("name", list.name);
        formData.append("content", updatedContent);
        formData.append("dueDate", list.due_date || "");
        formData.append("tags", list.tags.join(", "));

        await updateListAction(formData);
        onUpdate();
      } catch (error) {
        console.error("Failed to update checkbox:", error);
        // Revert on error
        setContent(list.content);
        checkbox.checked = !isChecked;
      }
    } else {
      console.error("Could not find matching line for checkbox");
      // Revert checkbox state
      checkbox.checked = !isChecked;
    }
  };

  const formatDate = (dateString: string) => {
    const dueDate = new Date(dateString + "T00:00:00");
    const now = new Date();

    const dueDateStart = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
    );
    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = dueDateStart.getTime() - nowStart.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

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
                    new Date(list.due_date + "T00:00:00") <
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate(),
                    )
                      ? "text-red-600 font-medium"
                      : new Date(list.due_date + "T00:00:00").toDateString() ===
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
        {content && (
          <div className="mb-4 prose prose-sm max-w-none prose-slate">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                // Make checkboxes interactive
                input: ({ type, checked, disabled, ...props }) => {
                  if (type === "checkbox") {
                    return (
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={false} // Override the disabled state from remark-gfm
                        onChange={handleCheckboxChange}
                        className="mr-2 rounded border-slate-300 cursor-pointer"
                        {...props}
                      />
                    );
                  }
                  return (
                    <input
                      type={type}
                      checked={checked}
                      disabled={disabled}
                      {...props}
                    />
                  );
                },

                // Style headings
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-slate-900 mb-4 mt-6 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold text-slate-800 mb-3 mt-5 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 mt-4 first:mt-0">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-base font-semibold text-slate-700 mb-2 mt-3 first:mt-0">
                    {children}
                  </h4>
                ),
                h5: ({ children }) => (
                  <h5 className="text-sm font-semibold text-slate-700 mb-1 mt-2 first:mt-0">
                    {children}
                  </h5>
                ),
                h6: ({ children }) => (
                  <h6 className="text-sm font-medium text-slate-600 mb-1 mt-2 first:mt-0">
                    {children}
                  </h6>
                ),

                // Style paragraphs
                p: ({ children }) => (
                  <p className="text-slate-700 mb-3 leading-relaxed last:mb-0">
                    {children}
                  </p>
                ),

                // Style lists
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 mb-4 last:mb-0 pl-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 mb-4 last:mb-0 pl-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-slate-700 py-1">{children}</li>
                ),

                // Style text formatting
                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-slate-800">{children}</em>
                ),

                // Style code
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-slate-100 text-slate-800 p-3 rounded-md text-sm font-mono overflow-x-auto mb-4">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-slate-100 text-slate-800 p-3 rounded-md text-sm font-mono overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),

                // Style blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-slate-300 pl-4 py-2 mb-4 text-slate-600 italic bg-slate-50 rounded-r">
                    {children}
                  </blockquote>
                ),

                // Style links
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-blue-600 hover:text-blue-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),

                // Style horizontal rules
                hr: () => <hr className="border-slate-300 my-6" />,

                // Style tables (from remark-gfm)
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border border-slate-300 rounded-md">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-slate-50">{children}</thead>
                ),
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => (
                  <tr className="border-b border-slate-200">{children}</tr>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-2 text-left font-semibold text-slate-900 border-r border-slate-300 last:border-r-0">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2 text-slate-700 border-r border-slate-300 last:border-r-0">
                    {children}
                  </td>
                ),

                // Style strikethrough (from remark-gfm)
                del: ({ children }) => (
                  <del className="text-slate-500">{children}</del>
                ),
              }}
            >
              {content}
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
