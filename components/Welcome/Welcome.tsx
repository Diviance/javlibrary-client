import { Title, Text, Stack, Card, Image, Badge, Button, Group, Grid } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Grid mt={25} gutter={40} justify="center" overflow="hidden">
        <Grid.Col span={3}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={1} fw={300}>Library Status</Title>
            <Group gap="xl" grow mt="md" mb="xs">
              <Stack>
                <Stack gap={0}>
                  <Text fz={13} c="mutedPurple">JAV Best</Text>
                  <Text fw={400}>729 Total</Text>
                  <Text fw={400}>0 Unavailable</Text>
                </Stack>
                <Stack gap={0}>
                  <Text fz={13} c="mutedPurple">JAV Good</Text>
                  <Text fw={400}>729 Total</Text>
                  <Text fw={400}>0 Unavailable</Text>
                </Stack>
                <Stack gap={0}>
                  <Text fz={13} c="mutedPurple">JAV Unchecked</Text>
                  <Text fw={400}>729 Total</Text>
                  <Text fw={400}>0 Unavailable</Text>
                </Stack>
              </Stack>
              <Stack>
                <Stack gap={0}>
                  <Text fz={13} c="mutedPurple">JAV Best</Text>
                  <Text fw={400}>729 Total</Text>
                  <Text fw={400}>0 Unavailable</Text>
                </Stack>
                <Stack gap={0}>
                  <Text fz={13} c="mutedPurple">JAV Good</Text>
                  <Text fw={400}>729 Total</Text>
                  <Text fw={400}>0 Unavailable</Text>
                </Stack>
                <Stack gap={0}>
                  <Text fz={13} c="mutedPurple">JAV Unchecked</Text>
                  <Text fw={400}>729 Total</Text>
                  <Text fw={400}>0 Unavailable</Text>
                </Stack>
              </Stack>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={1} fw={300}>Concat Status</Title>

            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Norway Fjord Adventures</Text>
              <Badge color="pink">On Sale</Badge>
            </Group>

            <Text size="sm" c="dimmed">
              With Fjord Tours you can explore more of the magical fjord landscapes with tours and
              activities on and around the fjords of Norway
            </Text>

            <Button color="blue" fullWidth mt="md" radius="md">
              Book classic tour now
            </Button>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={1} fw={300}>Javinizer Status</Title>

            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Norway Fjord Adventures</Text>
              <Badge color="pink">On Sale</Badge>
            </Group>

            <Text size="sm" c="dimmed">
              With Fjord Tours you can explore more of the magical fjord landscapes with tours and
              activities on and around the fjords of Norway
            </Text>

            <Button color="blue" fullWidth mt="md" radius="md">
              Book classic tour now
            </Button>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
}
