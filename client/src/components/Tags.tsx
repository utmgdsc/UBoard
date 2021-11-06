
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper/Paper";
import Stack from "@mui/material/Stack/Stack";

/* Generate pre-formatted TagItems based on an array of provided tags */
export default function GenerateTags(tags: Array<string>) {
  return (
    <Stack direction="row" spacing={2} style={{ alignItems: "center" }}>
      {tags.map((tag: string) => (
        <TagItem>{tag}</TagItem>
      ))}
    </Stack>
  );
}

/* Structure for each tag item -- colored "bubble" */
const TagItem = styled(Paper)(({ theme }) => ({
  ...theme.typography.caption,
  padding: theme.spacing(0.5, 2, 0.5, 2),
  textAlign: "center",
  color: theme.palette.text.primary,
  background: "#ef9a9a",
  borderRadius: "15px",
}));