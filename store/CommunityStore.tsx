import { create } from "zustand";
import { Follow, Guide, Message, Post, Tag, Thread } from "../utils/Types";
import { supabase } from "../lib/SupaBase";
import { useUserStore } from "./UserStore";

/*
-------------------------------------------------------------------------
---------------------------- ForumStore -------------------------
-------------------------------------------------------------------------
*/

interface TagState {
  tags: Tag[] | [];
  fetchTags: () => Promise<void>;
}

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  fetchTags: async () => {
    const { data: tagData, error: tagError } = await supabase
      .from("tag")
      .select("*");

    if (tagError) {
      return;
    }

    if (tagData) {
      set({ tags: tagData });
    }
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- ThreadStore -------------------------
-------------------------------------------------------------------------
*/

interface ThreadState {
  threads: Thread[] | [];
  fetchThreads: () => Promise<void>;
  addThread: (thread: Thread) => void;
  deleteThread: (thread: Thread) => void;
  updateThread: (updatedThread: Thread) => void;
}

export const useThreadStore = create<ThreadState>((set) => ({
  threads: [],
  fetchThreads: async () => {
    const { data: threadData, error: threadError } = await supabase
      .from("thread")
      .select("*");

    if (threadError) {
      return;
    }

    if (threadData) {
      set({ threads: threadData });
    }
  },
  addThread: (newThread) => {
    set((state) => ({
      threads: state.threads ? [...state.threads, newThread] : [newThread],
    }));
  },
  deleteThread: (deletedThread) => {
    set((state) => ({
      threads:
        state.threads?.filter((thread) => thread !== deletedThread) || null,
    }));
  },
  updateThread: (updatedThread) => {
    set((state) => ({
      threads: state.threads?.map((thread) =>
        thread.id === updatedThread.id ? updatedThread : thread
      ),
    }));
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- PostStore -------------------------
-------------------------------------------------------------------------
*/

interface PostState {
  posts: Post[] | [];
  fetchPosts: () => Promise<void>;
  addPost: (post: Post) => void;
  deletePost: (post: Post) => void;
  updatePost: (post: Post) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  fetchPosts: async () => {
    const { data: postData, error: postError } = await supabase
      .from("post")
      .select("*");
    if (postError) {
      return;
    }
    set({ posts: postData });
  },
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  deletePost: (deletePost) =>
    set((state) => ({
      posts: state.posts.filter((post) => post !== deletePost),
    })),
  updatePost: (updatePost) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === updatePost.id ? updatePost : post
      ),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- MessageStore -------------------------
-------------------------------------------------------------------------
*/

interface MessageState {
  messages: Message[] | [];
  fetchMessages: () => Promise<void>;
  addMessage: (post: Message) => void;
  deleteMessage: (post: Message) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  fetchMessages: async () => {
    const { user } = useUserStore.getState();
    const { data: messageData, error: messageError } = await supabase
      .from("message")
      .select("*")
      .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`);
    if (messageError) {
      return;
    }
    set({ messages: messageData });
  },
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
  deleteMessage: (deleteMessage) =>
    set((state) => ({
      messages: state.messages.filter(
        (message) => message.id !== deleteMessage.id
      ),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- FollowStore -------------------------
-------------------------------------------------------------------------
*/

interface FollowState {
  follows: Follow[] | [];
  fetchFollows: () => Promise<void>;
  addFollows: (newUser: Follow) => void;
  deleteFollow: (follow: Follow) => void;
  updateFollow: (updatedFollow: Follow) => void;
}

export const useFollowStore = create<FollowState>((set) => ({
  follows: [],
  fetchFollows: async () => {
    const { user } = useUserStore.getState();
    const { data: followData, error: followError } = await supabase
      .from("follow")
      .select("*")
      .eq("id", user?.id);

    if (followError) {
      return;
    }

    if (followData) {
      set({ follows: followData });
    }
  },
  addFollows: (newFollow) => {
    set((state) => ({
      follows: state.follows ? [...state.follows, newFollow] : [newFollow],
    }));
  },
  deleteFollow: (deletedFollow) => {
    set((state) => ({
      follows:
        state.follows?.filter((follow) => follow !== deletedFollow) || null,
    }));
  },
  updateFollow: (updatedFollow) => {
    set((state) => ({
      follows: state.follows?.map((follow) =>
        follow.id === updatedFollow.id ? updatedFollow : follow
      ),
    }));
  },
}));

/*
------------------------------------
----------- GuideStores ------------
------------------------------------
*/

interface DietitianGuideState {
  dietitianGuides: Guide[] | [];
  fetchDietitianGuides: () => Promise<void>;
  addGuide: (guide: Guide) => void;
  deleteGuide: (id: number) => void;
  updateGuide: (guide: Guide) => void;
}
export const useDietitianGuideStore = create<DietitianGuideState>((set) => ({
  dietitianGuides: [],
  fetchDietitianGuides: async () => {
    const { data: guideData, error: guideError } = await supabase
      .from("dietitianguide")
      .select("*");
    if (guideError) {
      return;
    }
    set({ dietitianGuides: guideData });
  },
  addGuide: (guide) =>
    set((state) => ({ dietitianGuides: [...state.dietitianGuides, guide] })),
  deleteGuide: (id) =>
    set((state) => ({
      dietitianGuides: state.dietitianGuides.filter((guide) => guide.id !== id),
    })),
  updateGuide: (updateGuide) =>
    set((state) => ({
      dietitianGuides: state.dietitianGuides.map((guide) =>
        guide.id === updateGuide.id ? updateGuide : guide
      ),
    })),
}));

interface PhysioGuideState {
  physioGuides: Guide[] | [];
  fetchPhysioGuides: () => Promise<void>;
  addGuide: (guide: Guide) => void;
  deleteGuide: (id: number) => void;
  updateGuide: (guide: Guide) => void;
}
export const usePhysioGuideStore = create<PhysioGuideState>((set) => ({
  physioGuides: [],
  fetchPhysioGuides: async () => {
    const { data: guideData, error: guideError } = await supabase
      .from("physioguide")
      .select("*");
    if (guideError) {
      return;
    }
    set({ physioGuides: guideData });
  },
  addGuide: (guide) =>
    set((state) => ({ physioGuides: [...state.physioGuides, guide] })),
  deleteGuide: (id) =>
    set((state) => ({
      physioGuides: state.physioGuides.filter((guide) => guide.id !== id),
    })),
  updateGuide: (updateGuide) =>
    set((state) => ({
      physioGuides: state.physioGuides.map((guide) =>
        guide.id === updateGuide.id ? updateGuide : guide
      ),
    })),
}));

interface PsychologistGuideState {
  psychologistGuides: Guide[] | [];
  fetchPsychologistGuides: () => Promise<void>;
  addGuide: (guide: Guide) => void;
  deleteGuide: (id: number) => void;
  updateGuide: (guide: Guide) => void;
}
export const usePsychologistGuideStore = create<PsychologistGuideState>(
  (set) => ({
    psychologistGuides: [],
    fetchPsychologistGuides: async () => {
      const { data: guideData, error: guideError } = await supabase
        .from("psychologistguide")
        .select("*");
      if (guideError) {
        return;
      }
      set({ psychologistGuides: guideData });
    },
    addGuide: (guide) =>
      set((state) => ({
        psychologistGuides: [...state.psychologistGuides, guide],
      })),
    deleteGuide: (id) =>
      set((state) => ({
        psychologistGuides: state.psychologistGuides.filter(
          (guide) => guide.id !== id
        ),
      })),
    updateGuide: (updateGuide) =>
      set((state) => ({
        psychologistGuides: state.psychologistGuides.map((guide) =>
          guide.id === updateGuide.id ? updateGuide : guide
        ),
      })),
  })
);
