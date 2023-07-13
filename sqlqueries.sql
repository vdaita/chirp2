/* create_post */

drop function create_post;

create or replace function create_post (
  user_contents text
) returns void
language plpgsql
as $$
begin
    insert into posts (posted_by, contents) values (auth.uid(), user_contents);
end; $$

/* create_user */

create or replace function create_user (
  user_id uuid,
  username text,
  bio text
) returns void
language plpgsql
as $$
begin
  insert into user_data (id, username, bio) values (user_id, username, bio);
end; $$

/* delete_post */

create or replace function delete_post (
  postid bigint
) returns boolean
language plpgsql
as $$
begin
  
end; $$

/* follow_user */

create or replace function follow_user(to_follow uuid)
returns void
language plpgsql
as $$
begin
  if not exists (select id from following where follower = auth.uid() and followed = to_follow) then 
    insert into following (follower, followed) values (auth.uid(), to_follow);
  end if;
end; $$

/* get_following_posts */

drop function get_following_posts();

create or replace function get_following_posts() 
	returns table (
		id int8,
		created_at timestamp,
		posted_by uuid,
		contents text,
		username text,
		avatar text,
    isLiked boolean,
		likes bigint,
		isFollowing boolean
	) 
as $$
begin
		return query SELECT posts.id, posts.created_at, posts.posted_by,
       posts.contents, (select user_data.username where user_data.id = auth.uid()) as username, (select user_data.avatar where user_data.id = auth.uid()), exists(select 1 from likes where likes.liker = auth.uid() and likes.post = posts.id) AS isLiked, (select count(*) from likes where likes.post = posts.id) as likes, (exists (select 1 from following where (following.followed = posts.posted_by and following.follower = auth.uid()))) AS isFollowing
    FROM posts
    left join user_data on user_data.id = posts.posted_by
    left join likes on likes.post = posts.id
    left join following on following.followed = posts.posted_by and following.followed = auth.uid()
    where (posts.created_at between NOW() - INTERVAL '24 hours' and NOW()) and (following.followed = posts.posted_by and following.follower = auth.uid())
		order by posts.created_at desc;
end;$$
	language plpgsql

/* get_recent_posts */

drop function get_recent_posts();

create or replace function get_recent_posts() 
	returns table (
		id int8,
		created_at timestamp,
		posted_by uuid,
		contents text,
		username text,
		avatar text,
    isLiked boolean,
		likes bigint,
		isFollowing boolean
	) 
as $$
begin
		return query SELECT posts.id, posts.created_at, posts.posted_by,
       posts.contents, (select user_data.username where user_data.id = auth.uid()) as username, (select user_data.avatar where user_data.id = auth.uid()), exists(select 1 from likes where likes.liker = auth.uid() and likes.post = posts.id) AS isLiked, (select count(*) from likes where likes.post = posts.id) as likes, (exists (select 1 from following where (following.followed = posts.posted_by and following.follower = auth.uid()))) AS isFollowing
    FROM posts
    left join user_data on user_data.id = posts.posted_by
    left join likes on likes.post = posts.id
    left join following on following.followed = posts.posted_by and following.followed = auth.uid()
    where (posts.created_at between NOW() - INTERVAL '24 hours' and NOW())
		order by posts.created_at desc;
end;$$
	language plpgsql

/* get_user_data */

drop function get_user_data;
create or replace function get_user_data(search_username text)
returns table (
		id uuid,
		username text,
    bio text,
    avatar text,
    created_at timestamp
    -- followed boolean
)
as $$ 
begin
	return query SELECT user_data.id, user_data.username, user_data.bio, user_data.avatar, user_data.created_at
    -- (exists (select 1 from following where (following.followed = user_data.id and following.follower = auth.uid())))
    FROM user_data
    -- inner join following on following.followed = user_data.id and following.follower = auth.uid()
    where user_data.username = search_username;
end;$$
	language plpgsql

/* get_user_posts */

drop function get_user_posts;

create or replace function get_user_posts(username_search text) 
	returns table (
		id int8,
		created_at timestamp,
		posted_by uuid,
		contents text,
		username text,
		avatar text,
    isLiked boolean,
		likes bigint,
		isFollowing boolean
	) 
as $$
begin
		return query SELECT posts.id, posts.created_at, posts.posted_by,
       posts.contents, (select user_data.username where user_data.id = auth.uid()) as username, (select user_data.avatar where user_data.id = auth.uid()), exists(select 1 from likes where likes.liker = auth.uid() and likes.post = posts.id) AS isLiked, (select count(*) from likes where likes.post = posts.id) as likes, (exists (select 1 from following where (following.followed = posts.posted_by and following.follower = auth.uid()))) AS isFollowing
    FROM posts
    left join user_data on user_data.id = posts.posted_by
    left join likes on likes.post = posts.id
    left join following on following.followed = posts.posted_by and following.followed = auth.uid()
    where (posts.created_at between NOW() - INTERVAL '24 hours' and NOW()) and (user_data.username = username_search)
		order by posts.created_at desc;
end;$$
	language plpgsql

/* like_post */

create or replace function like_post(post_id int8)
returns void
as $$ 
begin
  if not exists (select id from likes where likes.liker = auth.uid() and likes.post = post_id) then 
    insert into likes (liker, post) values (auth.uid(), post_id); 
  end if;
end; $$	language plpgsql

/* search_users */

drop function search_users;

create or replace function search_users(searchquery text)
returns table (
  id uuid,
  username text,
  bio text,
  avatar text,
  created_at timestamp,
  isFollowed boolean,
  followers bigint
)
language plpgsql
as $$
begin
  return query SELECT user_data.id, user_data.username, user_data.bio, user_data.avatar, user_data.created_at, (exists (select 1 from following where following.followed = user_data.id and following.follower = auth.uid())), (select count(*) from following where following.followed = user_data.id)
  from user_data
  where (user_data.username ilike '%' || searchquery || '%') or (user_data.bio ilike '%' || searchquery || '%')
  order by user_data.created_at desc;
end; $$

/* unfollow_user */

create or replace function unfollow_user(to_unfollow uuid)
returns void
language plpgsql
as $$
begin
  delete from following where follower = auth.uid() and followed = to_unfollow;
end; $$

/* update_bio */

create or replace function update_bio(user_id uuid, new_bio text)
returns void 
as $$
begin 
  if user_id == auth.uid() then
    update user_data set bio = new_bio where user_data.id = auth.uid();
  end if;
end; $$ language plpgsql