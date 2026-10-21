// Strip credential material from any User object before it leaves the API.
// Services previously returned Prisma rows verbatim, so every embedded
// reporter / member / lead / comment author leaked its bcrypt password hash.
export function withoutPassword<
  T extends Record<string, unknown> | null | undefined,
>(user: T): T {
  if (!user || typeof user !== 'object') return user;
  const { password, ...rest } = user;
  void password;
  return rest as T;
}

export function sanitizeTask<T extends Record<string, any>>(task: T): T {
  if (!task || typeof task !== 'object') return task;
  return {
    ...task,
    reporter: withoutPassword(task.reporter),
    members: Array.isArray(task.members)
      ? task.members.map((m: any) => withoutPassword(m))
      : task.members,
    comments: Array.isArray(task.comments)
      ? task.comments.map((c: any) => ({
          ...c,
          user: withoutPassword(c?.user),
        }))
      : task.comments,
  };
}

export function sanitizeProject<T extends Record<string, any>>(project: T): T {
  if (!project || typeof project !== 'object') return project;
  return {
    ...project,
    lead: withoutPassword(project.lead),
    members: Array.isArray(project.members)
      ? project.members.map((m: any) => withoutPassword(m))
      : project.members,
    tasks: Array.isArray(project.tasks)
      ? project.tasks.map((t: any) => sanitizeTask(t))
      : project.tasks,
  };
}
