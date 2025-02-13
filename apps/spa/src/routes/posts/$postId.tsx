import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  component: RouteComponent,
  pendingComponent: () => <div>Loading...</div>,
  loader: async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      post: {
        id: params.postId,
        title: `Post ${params.postId}`,
      },
    }
  },
})

function RouteComponent() {
  const { post } = Route.useLoaderData()
  return <div>{post.title}</div>
}
