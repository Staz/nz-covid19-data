export const exists = async (path: string) => {
  try {
    const f = await Deno.stat(path);
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return false;
    }
  }

  return true;
};

export const cleanHtml = (inputHtml: string) => {
  // Sigh, some MOH pages are riddled with these leading my regex to break
  return inputHtml.replace(/&nbsp;/g, ' ');
};
