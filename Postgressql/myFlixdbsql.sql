--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2023-11-29 10:30:50 PST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16409)
-- Name: directors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directors (
    directorid integer NOT NULL,
    name character varying(50) NOT NULL,
    bio character varying(1000),
    birthyear date,
    deathyear date
);


ALTER TABLE public.directors OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16408)
-- Name: directors_directorid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directors_directorid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directors_directorid_seq OWNER TO postgres;

--
-- TOC entry 3640 (class 0 OID 0)
-- Dependencies: 217
-- Name: directors_directorid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directors_directorid_seq OWNED BY public.directors.directorid;


--
-- TOC entry 216 (class 1259 OID 16400)
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    genreid integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(1000)
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: genres_genreid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genres_genreid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genres_genreid_seq OWNER TO postgres;

--
-- TOC entry 3641 (class 0 OID 0)
-- Dependencies: 215
-- Name: genres_genreid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genres_genreid_seq OWNED BY public.genres.genreid;


--
-- TOC entry 220 (class 1259 OID 16424)
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    movieid integer NOT NULL,
    title character varying(50) NOT NULL,
    description character varying(1000),
    directorid integer NOT NULL,
    genreid integer NOT NULL,
    imageurl character varying(300),
    featured boolean
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16423)
-- Name: movies_movieid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movies_movieid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movies_movieid_seq OWNER TO postgres;

--
-- TOC entry 3642 (class 0 OID 0)
-- Dependencies: 219
-- Name: movies_movieid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movies_movieid_seq OWNED BY public.movies.movieid;


--
-- TOC entry 224 (class 1259 OID 16450)
-- Name: user_favmovies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_favmovies (
    usermovieid integer NOT NULL,
    userid integer,
    movieid integer
);


ALTER TABLE public.user_favmovies OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16449)
-- Name: user_favmovies_usermovieid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_favmovies_usermovieid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_favmovies_usermovieid_seq OWNER TO postgres;

--
-- TOC entry 3643 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_favmovies_usermovieid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_favmovies_usermovieid_seq OWNED BY public.user_favmovies.usermovieid;


--
-- TOC entry 222 (class 1259 OID 16443)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    birth_date date
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16442)
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_userid_seq OWNER TO postgres;

--
-- TOC entry 3644 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;


--
-- TOC entry 3464 (class 2604 OID 16412)
-- Name: directors directorid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directors ALTER COLUMN directorid SET DEFAULT nextval('public.directors_directorid_seq'::regclass);


--
-- TOC entry 3463 (class 2604 OID 16403)
-- Name: genres genreid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres ALTER COLUMN genreid SET DEFAULT nextval('public.genres_genreid_seq'::regclass);


--
-- TOC entry 3465 (class 2604 OID 16427)
-- Name: movies movieid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies ALTER COLUMN movieid SET DEFAULT nextval('public.movies_movieid_seq'::regclass);


--
-- TOC entry 3467 (class 2604 OID 16453)
-- Name: user_favmovies usermovieid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favmovies ALTER COLUMN usermovieid SET DEFAULT nextval('public.user_favmovies_usermovieid_seq'::regclass);


--
-- TOC entry 3466 (class 2604 OID 16446)
-- Name: users userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);


--
-- TOC entry 3628 (class 0 OID 16409)
-- Dependencies: 218
-- Data for Name: directors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.directors (directorid, name, bio, birthyear, deathyear) VALUES (64, 'Michael Bay', 'Michael Bay is an American director, producer, and screenwriter.', '1965-02-17', NULL);
INSERT INTO public.directors (directorid, name, bio, birthyear, deathyear) VALUES (65, 'James Cameron', 'James Cameron is an American director, producer, and screenwriter.', '1954-08-16', NULL);
INSERT INTO public.directors (directorid, name, bio, birthyear, deathyear) VALUES (66, 'Ryan Coogler', 'Ryan Coogler is an American director, producer, and screenwriter.', '1986-05-23', NULL);
INSERT INTO public.directors (directorid, name, bio, birthyear, deathyear) VALUES (67, 'Peyton Reed', 'Peyton Reed is an American director, producer, and screenwriter.', '1964-07-03', NULL);
INSERT INTO public.directors (directorid, name, bio, birthyear, deathyear) VALUES (68, 'Jon Favreau', 'Jon Favreau is an American director, producer, and screenwriter.', '1966-10-19', NULL);
INSERT INTO public.directors (directorid, name, bio, birthyear, deathyear) VALUES (69, 'Jon Watts', 'Jon Watts is an American director, producer, and screenwriter.', '1981-06-28', NULL);
INSERT INTO public.directors (directorid, name, bio, birthyear, deathyear) VALUES (70, 'Bob Persichetti', 'Bob Persichetti is an American director, producer, and screenwriter.', '1973-01-17', NULL);
INSERT INTO public.directors (directorid, name, bio, birthyear, deathyear) VALUES (71, 'Joaquim Dos Santos', 'Joaquim Dos Santos is an American director, producer, and screenwriter.', '1977-06-22', NULL);
INSERT INTO public.directors (directorid, name, bio, birthyear, deathyear) VALUES (72, 'Alfonso Cuarón', 'Alfonso Cuarón is an American director, producer, and screenwriter.', '1961-11-28', NULL);


--
-- TOC entry 3626 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.genres (genreid, name, description) VALUES (41, 'Animated', 'Animation is a method in which pictures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film.');
INSERT INTO public.genres (genreid, name, description) VALUES (42, 'Comedy', 'Comedy is a genre of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.');
INSERT INTO public.genres (genreid, name, description) VALUES (43, 'Action', 'Action should contain numerous scenes where action is spectacular and usually destructive. Often includes non-stop motion, high energy physical stunts, chases, battles, and destructive crises (floods, explosions, natural disasters, fires, etc.) ');
INSERT INTO public.genres (genreid, name, description) VALUES (44, 'Sci-Fi', 'Sci-Fi conatins numerous scenes, and/or the entire background for the setting of the narrative, should be based on speculative scientific discoveries or developments, environmental changes, space travel, or life on other planets.');


--
-- TOC entry 3630 (class 0 OID 16424)
-- Dependencies: 220
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.movies (movieid, title, description, directorid, genreid, imageurl, featured) VALUES (7, 'Transformers', 'An ancient struggle between two Cybertronian races, the heroic Autobots and the evil Decepticons, comes to Earth, with a clue to the ultimate power held by a teenager.', 64, 43, 'Transformers07.jpg', true);
INSERT INTO public.movies (movieid, title, description, directorid, genreid, imageurl, featured) VALUES (8, 'Terminator 2: Judgement Day', 'A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her ten year old son John from an even more advanced and powerful cyborg.', 65, 43, 'Terminator2.jpg', true);
INSERT INTO public.movies (movieid, title, description, directorid, genreid, imageurl, featured) VALUES (9, 'Antman', 'Ant-Man is a legacy super-hero name, primarily associated with the ability to shrink in size.', 67, 43, 'Antman.jpg', true);
INSERT INTO public.movies (movieid, title, description, directorid, genreid, imageurl, featured) VALUES (10, 'Black Panther: Wakanda Forever', 'The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T''Challa.', 66, 43, 'BlackPantherWakanda.jpg', true);
INSERT INTO public.movies (movieid, title, description, directorid, genreid, imageurl, featured) VALUES (12, 'Antman and the Wasp', 'Sequal where Scott Lang and Hope Van Dyne as they team up on a mission, confronting challenges in the Quantum Realm while dealing with family dynamics and a mysterious new adversary named Ghost.', 67, 43, 'Antmanwasp.jpg', true);
INSERT INTO public.movies (movieid, title, description, directorid, genreid, imageurl, featured) VALUES (14, 'Spiderman No Way Home', 'Peter Parker''s world upended when his secret identity is exposed. Teaming up with other Spider-People from alternate universes, he grapples with the consequences of meddling with reality while facing formidable foes from across the multiverse.', 69, 43, 'Spidermannowayhome.jpg', true);
INSERT INTO public.movies (movieid, title, description, directorid, genreid, imageurl, featured) VALUES (15, 'Spider-Man: Into the Spiderverse', 'Miles Morales as he discovers multiple Spider-People from different dimensions. Together, they must stop a threat to all realities while Miles learns to embrace his own unique Spider-Man abilities. The film''s animated style and diverse cast of characters make it a visually stunning and engaging superhero adventure.', 70, 41, 'Intothespidervse.jpg', true);
INSERT INTO public.movies (movieid, title, description, directorid, genreid, imageurl, featured) VALUES (16, 'Spiderman: Across the Spiderverse', 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.', 71, 41, 'Acrossspiderverse.jpg', true);
INSERT INTO public.movies (movieid, title, description, directorid, genreid, imageurl, featured) VALUES (17, 'Gravity', 'A gripping sci-fi thriller that follows astronauts Dr. Ryan Stone and Matt Kowalski stranded in space after their shuttle is destroyed. As they face dwindling oxygen and the vastness of space, the film explores themes of survival, isolation, and the indomitable human spirit in the face of adversity.', 72, 44, 'Gravity.jpg', true);


--
-- TOC entry 3634 (class 0 OID 16450)
-- Dependencies: 224
-- Data for Name: user_favmovies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_favmovies (usermovieid, userid, movieid) VALUES (1, 1, 7);
INSERT INTO public.user_favmovies (usermovieid, userid, movieid) VALUES (2, 2, 8);
INSERT INTO public.user_favmovies (usermovieid, userid, movieid) VALUES (3, 3, 9);


--
-- TOC entry 3632 (class 0 OID 16443)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (userid, username, password, email, birth_date) VALUES (2, 'jane_smith', 'pass456', 'jane.smith@example.com', '1985-08-22');
INSERT INTO public.users (userid, username, password, email, birth_date) VALUES (3, 'bob_jones', 'secure789', 'bob.jones@example.com', '1992-03-01');
INSERT INTO public.users (userid, username, password, email, birth_date) VALUES (1, 'john_doe', 'password123', 'changed@newmail.com', '1990-05-15');


--
-- TOC entry 3645 (class 0 OID 0)
-- Dependencies: 217
-- Name: directors_directorid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directors_directorid_seq', 72, true);


--
-- TOC entry 3646 (class 0 OID 0)
-- Dependencies: 215
-- Name: genres_genreid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genres_genreid_seq', 44, true);


--
-- TOC entry 3647 (class 0 OID 0)
-- Dependencies: 219
-- Name: movies_movieid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_movieid_seq', 17, true);


--
-- TOC entry 3648 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_favmovies_usermovieid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_favmovies_usermovieid_seq', 1, false);


--
-- TOC entry 3649 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_userid_seq', 1, false);


--
-- TOC entry 3471 (class 2606 OID 16416)
-- Name: directors directors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directors
    ADD CONSTRAINT directors_pkey PRIMARY KEY (directorid);


--
-- TOC entry 3469 (class 2606 OID 16407)
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (genreid);


--
-- TOC entry 3473 (class 2606 OID 16431)
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movieid);


--
-- TOC entry 3477 (class 2606 OID 16455)
-- Name: user_favmovies user_favmovies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favmovies
    ADD CONSTRAINT user_favmovies_pkey PRIMARY KEY (usermovieid);


--
-- TOC entry 3475 (class 2606 OID 16448)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- TOC entry 3478 (class 2606 OID 16437)
-- Name: movies directorkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT directorkey FOREIGN KEY (directorid) REFERENCES public.directors(directorid);


--
-- TOC entry 3479 (class 2606 OID 16432)
-- Name: movies genrekey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT genrekey FOREIGN KEY (genreid) REFERENCES public.genres(genreid);


--
-- TOC entry 3480 (class 2606 OID 16461)
-- Name: user_favmovies moviekey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favmovies
    ADD CONSTRAINT moviekey FOREIGN KEY (movieid) REFERENCES public.movies(movieid);


--
-- TOC entry 3481 (class 2606 OID 16456)
-- Name: user_favmovies userkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favmovies
    ADD CONSTRAINT userkey FOREIGN KEY (userid) REFERENCES public.users(userid);


-- Completed on 2023-11-29 10:30:51 PST

--
-- PostgreSQL database dump complete
--

