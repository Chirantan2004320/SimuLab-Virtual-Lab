export const getAssignmentsForUser = (user) => {
  try {
    if (user && user.id) {
      return JSON.parse(
        localStorage.getItem(`vlab_assignments_${user.id}`) || "[]"
      );
    }
  } catch (e) {}

  try {
    return JSON.parse(
      localStorage.getItem("vlab_assignments") || "[]"
    );
  } catch (e) {
    return [];
  }
};

export const saveAssignmentForUser = (user, assignment) => {
  try {
    if (user && user.id) {
      const key = `vlab_assignments_${user.id}`;

      const list = JSON.parse(
        localStorage.getItem(key) || "[]"
      );

      list.push(assignment);

      localStorage.setItem(key, JSON.stringify(list));

      return true;
    }
  } catch (e) {
    console.error("Error saving user assignment", e);
  }

  try {
    const list = JSON.parse(
      localStorage.getItem("vlab_assignments") || "[]"
    );

    list.push(assignment);

    localStorage.setItem(
      "vlab_assignments",
      JSON.stringify(list)
    );

    return true;
  } catch (e) {
    return false;
  }
};

export const computeAssignmentProgress = (user) => {
  const assignments = getAssignmentsForUser(user);

  if (!assignments || assignments.length === 0) {
    return {
      total: 0,
      submitted: 0,
      remaining: 0,
      nextDue: null,
      details: [],
    };
  }

  const now = Date.now();

  const details = assignments.map((a) => {
    const due = a.due
      ? new Date(a.due).getTime()
      : null;

    const submitted = !!a.submitted;

    const daysLeft = due
      ? Math.ceil(
          (due - now) / (1000 * 60 * 60 * 24)
        )
      : null;

    return {
      ...a,
      dueTimestamp: due,
      submitted,
      daysLeft,
    };
  });

  const total = details.length;

  const submitted = details.filter(
    (d) => d.submitted
  ).length;

  const remaining = total - submitted;

  const upcoming =
    details
      .filter(
        (d) => !d.submitted && d.dueTimestamp
      )
      .sort(
        (x, y) =>
          x.dueTimestamp - y.dueTimestamp
      )[0] || null;

  return {
    total,
    submitted,
    remaining,
    nextDue: upcoming,
    details,
  };
};