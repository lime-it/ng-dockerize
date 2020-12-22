import {
  Rule, Tree, SchematicsException, FileEntry, SchematicContext,
  apply, url, applyTemplates,
  chain, mergeWith, forEach, source
} from '@angular-devkit/schematics';

import * as ts from 'typescript';

import { normalize, join } from '@angular-devkit/core';

import { addImportToModule } from "@schematics/angular/utility/ast-utils";
import { findModule } from "@schematics/angular/utility/find-module";

import { Schema as InitSchema } from './schema';
import { PathChangesBuffer } from '../utils';

export function Initialize(options: InitSchema): Rule {
  return (tree: Tree) => {
    const workspaceConfig = tree.read('/angular.json');
    if (!workspaceConfig) {
      throw new SchematicsException('Could not find Angular workspace configuration');
    }

    options.imageTag = options.imageTag || "latest";

    // convert workspace to string
    const workspaceContent = workspaceConfig.toString();

    // parse workspace string into JSON object
    const workspace: any = JSON.parse(workspaceContent);
    if (!options.project) {
      options.project = workspace.defaultProject;
    }

    const projectName = options.project as string;

    const project = workspace.projects[projectName];

    if (project.projectType !== 'application') {
      throw new SchematicsException('Only "application" projects can be initialized.');
    }

    const templateSource = apply(url('./files'), [
      applyTemplates({
        imageTag: options.imageTag,
        projectName: projectName
      }),
      forEach((fileEntry: FileEntry) => {
        const destPath = join(normalize(project.sourceRoot as string), fileEntry.path);
        if (tree.exists(destPath)) {
          tree.overwrite(destPath, fileEntry.content);
        } else {
          tree.create(destPath, fileEntry.content);
        }
        return null;
      })
    ]);

    const modulePath = findModule(tree, join(normalize(project.sourceRoot as string), "app"));

    const importModule = async (t:Tree, c:SchematicContext) => {

      const changes = addImportToModule(
        ts.createSourceFile(modulePath, tree.read(modulePath)!.toString('utf-8'), ts.ScriptTarget.Latest, true),
        modulePath,
        "NgDockerizeModule",
        "@lime.it/ng-dockerize"
      );

      const buffer = new PathChangesBuffer(t, modulePath);
      for(let change of changes)
        await change.apply(buffer);

      if(!!buffer.currentBuffer)
        t.overwrite(modulePath, buffer.currentBuffer as string);
    };

    const addEnvironmentFiles = (t:Tree, c:SchematicContext) => {
      ["development","staging","production"]
      .map(name=>({path:join(normalize(project.sourceRoot as string), "assets", "environments",`environment.${name}.json`), env:name}))
      .forEach(conf=>{
        if(!tree.exists(conf.path))
          t.create(conf.path, JSON.stringify({production:true, environment: conf.env}, null, 2));
      });
    }

    return chain([
      mergeWith(templateSource),
      importModule,
      addEnvironmentFiles
    ]);
  };
}