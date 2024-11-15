PGDMP  &    $            
    |            pos_project    16.4    16.4 Q    T           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            U           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            V           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            W           1262    33722    pos_project    DATABASE     �   CREATE DATABASE pos_project WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE pos_project;
                postgres    false            �            1259    33810    expenses    TABLE     �   CREATE TABLE public.expenses (
    expense_id integer NOT NULL,
    description character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.expenses;
       public         heap    postgres    false            �            1259    33809    expenses_expense_id_seq    SEQUENCE     �   CREATE SEQUENCE public.expenses_expense_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.expenses_expense_id_seq;
       public          postgres    false    228            X           0    0    expenses_expense_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.expenses_expense_id_seq OWNED BY public.expenses.expense_id;
          public          postgres    false    227            �            1259    33735    products    TABLE     w  CREATE TABLE public.products (
    product_id integer NOT NULL,
    product_code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    sku character varying(100) NOT NULL,
    cost_price numeric(10,2) NOT NULL,
    selling_price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    33734    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public          postgres    false    218            Y           0    0    products_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;
          public          postgres    false    217            �            1259    33818    profit_loss    TABLE     �   CREATE TABLE public.profit_loss (
    id integer NOT NULL,
    start_date date,
    end_date date,
    total_revenue numeric(10,2),
    total_cost numeric(10,2),
    total_expenses numeric(10,2),
    profit numeric(10,2)
);
    DROP TABLE public.profit_loss;
       public         heap    postgres    false            �            1259    33817    profit_loss_id_seq    SEQUENCE     �   CREATE SEQUENCE public.profit_loss_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.profit_loss_id_seq;
       public          postgres    false    230            Z           0    0    profit_loss_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.profit_loss_id_seq OWNED BY public.profit_loss.id;
          public          postgres    false    229            �            1259    33795 	   purchases    TABLE     $  CREATE TABLE public.purchases (
    purchase_id integer NOT NULL,
    purchase_code character varying(10) NOT NULL,
    product_id bigint,
    quantity bigint,
    cost_price numeric(10,2) NOT NULL,
    total_cost numeric(10,2),
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.purchases;
       public         heap    postgres    false            �            1259    33794    purchases_purchase_id_seq    SEQUENCE     �   CREATE SEQUENCE public.purchases_purchase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.purchases_purchase_id_seq;
       public          postgres    false    226            [           0    0    purchases_purchase_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.purchases_purchase_id_seq OWNED BY public.purchases.purchase_id;
          public          postgres    false    225            �            1259    33748 	   resellers    TABLE     A  CREATE TABLE public.resellers (
    reseller_id integer NOT NULL,
    reseller_code character(10) NOT NULL,
    user_id integer,
    commission_percentage numeric(5,2),
    CONSTRAINT resellers_commission_percentage_check CHECK (((commission_percentage >= (0)::numeric) AND (commission_percentage <= (100)::numeric)))
);
    DROP TABLE public.resellers;
       public         heap    postgres    false            �            1259    33747    resellers_reseller_id_seq    SEQUENCE     �   CREATE SEQUENCE public.resellers_reseller_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.resellers_reseller_id_seq;
       public          postgres    false    220            \           0    0    resellers_reseller_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.resellers_reseller_id_seq OWNED BY public.resellers.reseller_id;
          public          postgres    false    219            �            1259    33763    sales    TABLE     �   CREATE TABLE public.sales (
    sale_id integer NOT NULL,
    sale_code character varying(10) NOT NULL,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reseller_id bigint,
    total_amount numeric(10,2),
    profit numeric(10,2)
);
    DROP TABLE public.sales;
       public         heap    postgres    false            �            1259    33778    sales_items    TABLE     �   CREATE TABLE public.sales_items (
    sales_item_id integer NOT NULL,
    sale_id bigint,
    product_id bigint,
    quantity bigint,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL
);
    DROP TABLE public.sales_items;
       public         heap    postgres    false            �            1259    33777    sales_items_sales_item_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sales_items_sales_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.sales_items_sales_item_id_seq;
       public          postgres    false    224            ]           0    0    sales_items_sales_item_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.sales_items_sales_item_id_seq OWNED BY public.sales_items.sales_item_id;
          public          postgres    false    223            �            1259    33762    sales_sale_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sales_sale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.sales_sale_id_seq;
       public          postgres    false    222            ^           0    0    sales_sale_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.sales_sale_id_seq OWNED BY public.sales.sale_id;
          public          postgres    false    221            �            1259    33825    sessions    TABLE     �   CREATE TABLE public.sessions (
    session_id integer NOT NULL,
    user_id integer,
    jwt_token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.sessions;
       public         heap    postgres    false            �            1259    33824    sessions_session_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sessions_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.sessions_session_id_seq;
       public          postgres    false    232            _           0    0    sessions_session_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.sessions_session_id_seq OWNED BY public.sessions.session_id;
          public          postgres    false    231            �            1259    33724    users    TABLE     u  CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_users_role CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'cashier'::character varying, 'reseller'::character varying])::text[]))),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'cashier'::character varying, 'reseller'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    33723    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false    216            `           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          postgres    false    215            �           2604    33813    expenses expense_id    DEFAULT     z   ALTER TABLE ONLY public.expenses ALTER COLUMN expense_id SET DEFAULT nextval('public.expenses_expense_id_seq'::regclass);
 B   ALTER TABLE public.expenses ALTER COLUMN expense_id DROP DEFAULT;
       public          postgres    false    227    228    228            z           2604    33738    products product_id    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    217    218    218            �           2604    33821    profit_loss id    DEFAULT     p   ALTER TABLE ONLY public.profit_loss ALTER COLUMN id SET DEFAULT nextval('public.profit_loss_id_seq'::regclass);
 =   ALTER TABLE public.profit_loss ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    230    230            �           2604    33798    purchases purchase_id    DEFAULT     ~   ALTER TABLE ONLY public.purchases ALTER COLUMN purchase_id SET DEFAULT nextval('public.purchases_purchase_id_seq'::regclass);
 D   ALTER TABLE public.purchases ALTER COLUMN purchase_id DROP DEFAULT;
       public          postgres    false    225    226    226            }           2604    33751    resellers reseller_id    DEFAULT     ~   ALTER TABLE ONLY public.resellers ALTER COLUMN reseller_id SET DEFAULT nextval('public.resellers_reseller_id_seq'::regclass);
 D   ALTER TABLE public.resellers ALTER COLUMN reseller_id DROP DEFAULT;
       public          postgres    false    219    220    220            ~           2604    33766    sales sale_id    DEFAULT     n   ALTER TABLE ONLY public.sales ALTER COLUMN sale_id SET DEFAULT nextval('public.sales_sale_id_seq'::regclass);
 <   ALTER TABLE public.sales ALTER COLUMN sale_id DROP DEFAULT;
       public          postgres    false    222    221    222            �           2604    33781    sales_items sales_item_id    DEFAULT     �   ALTER TABLE ONLY public.sales_items ALTER COLUMN sales_item_id SET DEFAULT nextval('public.sales_items_sales_item_id_seq'::regclass);
 H   ALTER TABLE public.sales_items ALTER COLUMN sales_item_id DROP DEFAULT;
       public          postgres    false    223    224    224            �           2604    33828    sessions session_id    DEFAULT     z   ALTER TABLE ONLY public.sessions ALTER COLUMN session_id SET DEFAULT nextval('public.sessions_session_id_seq'::regclass);
 B   ALTER TABLE public.sessions ALTER COLUMN session_id DROP DEFAULT;
       public          postgres    false    231    232    232            x           2604    33727    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    216    215    216            M          0    33810    expenses 
   TABLE DATA           I   COPY public.expenses (expense_id, description, amount, date) FROM stdin;
    public          postgres    false    228   qd       C          0    33735    products 
   TABLE DATA           u   COPY public.products (product_id, product_code, name, sku, cost_price, selling_price, stock, created_at) FROM stdin;
    public          postgres    false    218   �d       O          0    33818    profit_loss 
   TABLE DATA           r   COPY public.profit_loss (id, start_date, end_date, total_revenue, total_cost, total_expenses, profit) FROM stdin;
    public          postgres    false    230   �d       K          0    33795 	   purchases 
   TABLE DATA           s   COPY public.purchases (purchase_id, purchase_code, product_id, quantity, cost_price, total_cost, date) FROM stdin;
    public          postgres    false    226   �d       E          0    33748 	   resellers 
   TABLE DATA           _   COPY public.resellers (reseller_id, reseller_code, user_id, commission_percentage) FROM stdin;
    public          postgres    false    220   �d       G          0    33763    sales 
   TABLE DATA           \   COPY public.sales (sale_id, sale_code, date, reseller_id, total_amount, profit) FROM stdin;
    public          postgres    false    222   e       I          0    33778    sales_items 
   TABLE DATA           l   COPY public.sales_items (sales_item_id, sale_id, product_id, quantity, unit_price, total_price) FROM stdin;
    public          postgres    false    224   e       Q          0    33825    sessions 
   TABLE DATA           Z   COPY public.sessions (session_id, user_id, jwt_token, expires_at, created_at) FROM stdin;
    public          postgres    false    232   <e       A          0    33724    users 
   TABLE DATA           Q   COPY public.users (user_id, name, email, password, role, created_at) FROM stdin;
    public          postgres    false    216   Ye       a           0    0    expenses_expense_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.expenses_expense_id_seq', 1, false);
          public          postgres    false    227            b           0    0    products_product_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.products_product_id_seq', 1, false);
          public          postgres    false    217            c           0    0    profit_loss_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.profit_loss_id_seq', 1, false);
          public          postgres    false    229            d           0    0    purchases_purchase_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.purchases_purchase_id_seq', 1, false);
          public          postgres    false    225            e           0    0    resellers_reseller_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.resellers_reseller_id_seq', 1, false);
          public          postgres    false    219            f           0    0    sales_items_sales_item_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.sales_items_sales_item_id_seq', 1, false);
          public          postgres    false    223            g           0    0    sales_sale_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.sales_sale_id_seq', 1, false);
          public          postgres    false    221            h           0    0    sessions_session_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.sessions_session_id_seq', 1, false);
          public          postgres    false    231            i           0    0    users_user_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_user_id_seq', 4, true);
          public          postgres    false    215            �           2606    33816    expenses expenses_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (expense_id);
 @   ALTER TABLE ONLY public.expenses DROP CONSTRAINT expenses_pkey;
       public            postgres    false    228            �           2606    33742    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    218            �           2606    66492 "   products products_product_code_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_product_code_key UNIQUE (product_code);
 L   ALTER TABLE ONLY public.products DROP CONSTRAINT products_product_code_key;
       public            postgres    false    218            �           2606    33746    products products_sku_key 
   CONSTRAINT     S   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);
 C   ALTER TABLE ONLY public.products DROP CONSTRAINT products_sku_key;
       public            postgres    false    218            �           2606    33823    profit_loss profit_loss_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.profit_loss
    ADD CONSTRAINT profit_loss_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.profit_loss DROP CONSTRAINT profit_loss_pkey;
       public            postgres    false    230            �           2606    33801    purchases purchases_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (purchase_id);
 B   ALTER TABLE ONLY public.purchases DROP CONSTRAINT purchases_pkey;
       public            postgres    false    226            �           2606    66562 %   purchases purchases_purchase_code_key 
   CONSTRAINT     i   ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_purchase_code_key UNIQUE (purchase_code);
 O   ALTER TABLE ONLY public.purchases DROP CONSTRAINT purchases_purchase_code_key;
       public            postgres    false    226            �           2606    33754    resellers resellers_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.resellers
    ADD CONSTRAINT resellers_pkey PRIMARY KEY (reseller_id);
 B   ALTER TABLE ONLY public.resellers DROP CONSTRAINT resellers_pkey;
       public            postgres    false    220            �           2606    33756 %   resellers resellers_reseller_code_key 
   CONSTRAINT     i   ALTER TABLE ONLY public.resellers
    ADD CONSTRAINT resellers_reseller_code_key UNIQUE (reseller_code);
 O   ALTER TABLE ONLY public.resellers DROP CONSTRAINT resellers_reseller_code_key;
       public            postgres    false    220            �           2606    33783    sales_items sales_items_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT sales_items_pkey PRIMARY KEY (sales_item_id);
 F   ALTER TABLE ONLY public.sales_items DROP CONSTRAINT sales_items_pkey;
       public            postgres    false    224            �           2606    33769    sales sales_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (sale_id);
 :   ALTER TABLE ONLY public.sales DROP CONSTRAINT sales_pkey;
       public            postgres    false    222            �           2606    66507    sales sales_sale_code_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_sale_code_key UNIQUE (sale_code);
 C   ALTER TABLE ONLY public.sales DROP CONSTRAINT sales_sale_code_key;
       public            postgres    false    222            �           2606    33833    sessions sessions_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_id);
 @   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
       public            postgres    false    232            �           2606    33733    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    216            �           2606    33731    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �           2606    66556    products fk_purchases_product    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_purchases_product FOREIGN KEY (product_id) REFERENCES public.purchases(purchase_id);
 G   ALTER TABLE ONLY public.products DROP CONSTRAINT fk_purchases_product;
       public          postgres    false    4768    218    226            �           2606    66551     sales_items fk_sales_sales_items    FK CONSTRAINT     �   ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT fk_sales_sales_items FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id);
 J   ALTER TABLE ONLY public.sales_items DROP CONSTRAINT fk_sales_sales_items;
       public          postgres    false    224    222    4762            �           2606    66568 #   purchases purchases_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE RESTRICT;
 M   ALTER TABLE ONLY public.purchases DROP CONSTRAINT purchases_product_id_fkey;
       public          postgres    false    218    4752    226            �           2606    33757     resellers resellers_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.resellers
    ADD CONSTRAINT resellers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.resellers DROP CONSTRAINT resellers_user_id_fkey;
       public          postgres    false    4750    220    216            �           2606    66538 '   sales_items sales_items_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT sales_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE RESTRICT;
 Q   ALTER TABLE ONLY public.sales_items DROP CONSTRAINT sales_items_product_id_fkey;
       public          postgres    false    4752    218    224            �           2606    66529 $   sales_items sales_items_sale_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT sales_items_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.sales_items DROP CONSTRAINT sales_items_sale_id_fkey;
       public          postgres    false    222    224    4762            �           2606    66519    sales sales_reseller_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_reseller_id_fkey FOREIGN KEY (reseller_id) REFERENCES public.resellers(reseller_id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.sales DROP CONSTRAINT sales_reseller_id_fkey;
       public          postgres    false    4758    222    220            �           2606    33834    sessions sessions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_user_id_fkey;
       public          postgres    false    232    216    4750            M      x������ � �      C      x������ � �      O      x������ � �      K      x������ � �      E      x������ � �      G      x������ � �      I      x������ � �      Q      x������ � �      A   �   x�m��R�0��u�
l����iXIA����Sla�d Hi!�vZ�^]�{�l�(6ug�F�f���[}UmҸ0-r�r�8�2��3K��K�߱�q�����_�+<mӛD�$�Uwyz�FT����?%t�q��)xDz�l.��P�:�so�}��t��i8���1z�<�<�W�d��?,�dGbN�Z�>?ob9dc��p���T��?��۔N
�3�\Zoز�o`UM�     