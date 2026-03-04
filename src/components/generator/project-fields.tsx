"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AideclProject, FormErrors } from "@/lib/aidecl-types";

interface ProjectFieldsProps {
  values: AideclProject;
  contentType: string;
  onChange: (field: string, value: string) => void;
  errors: FormErrors;
}

export default function ProjectFields({ values, contentType, onChange, errors }: ProjectFieldsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name *</Label>
            <Input
              id="project-name"
              placeholder="my-project"
              value={values.name}
              onChange={(e) => onChange("project.name", e.target.value)}
              aria-invalid={!!errors["project.name"]}
              aria-describedby={errors["project.name"] ? "error-project-name" : undefined}
            />
            {errors["project.name"] && (
              <p id="error-project-name" role="alert" className="text-sm text-error">
                {errors["project.name"]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-repo">Repository URL</Label>
            <Input
              id="project-repo"
              placeholder="https://github.com/org/repo"
              value={values.repository || ""}
              onChange={(e) => onChange("project.repository", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-version">Version</Label>
            <Input
              id="project-version"
              placeholder="1.0.0"
              value={values.version || ""}
              onChange={(e) => onChange("project.version", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-license">License</Label>
            <Input
              id="project-license"
              placeholder="MIT"
              value={values.license || ""}
              onChange={(e) => onChange("project.license", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="content-type">Content Type</Label>
          <Select value={contentType} onValueChange={(v) => onChange("content_type", v)}>
            <SelectTrigger id="content-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="dataset">Dataset</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="model">Model</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
