PGDMP                  
    |            pos5    16.4    16.4 S    `           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            a           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            b           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            c           1262    94467    pos5    DATABASE     {   CREATE DATABASE pos5 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE pos5;
                postgres    false            �            1255    94808    generate_category_code()    FUNCTION     �   CREATE FUNCTION public.generate_category_code() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.category_code := (
        SELECT COALESCE(MAX(category_code::INTEGER), 0) + 1
        FROM categories
    )::TEXT;
    RETURN NEW;
END;
$$;
 /   DROP FUNCTION public.generate_category_code();
       public          postgres    false            �            1259    94533 
   categories    TABLE       CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_code character varying(3) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    94532    categories_category_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.categories_category_id_seq;
       public          postgres    false    216            d           0    0    categories_category_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;
          public          postgres    false    215            �            1259    94612    expenses    TABLE       CREATE TABLE public.expenses (
    expense_id integer NOT NULL,
    description character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT expenses_amount_check CHECK ((amount >= (0)::numeric))
);
    DROP TABLE public.expenses;
       public         heap    postgres    false            �            1259    94611    expenses_expense_id_seq    SEQUENCE     �   CREATE SEQUENCE public.expenses_expense_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.expenses_expense_id_seq;
       public          postgres    false    226            e           0    0    expenses_expense_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.expenses_expense_id_seq OWNED BY public.expenses.expense_id;
          public          postgres    false    225            �            1259    94546    products    TABLE     �  CREATE TABLE public.products (
    product_id integer NOT NULL,
    product_code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    cost_price numeric(10,2) NOT NULL,
    selling_price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0,
    category_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_products_stock CHECK ((stock >= 0)),
    CONSTRAINT products_check CHECK ((selling_price >= cost_price)),
    CONSTRAINT products_cost_price_check CHECK ((cost_price >= (0)::numeric)),
    CONSTRAINT products_stock_check CHECK ((stock >= 0))
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    94545    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public          postgres    false    218            f           0    0    products_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;
          public          postgres    false    217            �            1259    94566 	   purchases    TABLE     D  CREATE TABLE public.purchases (
    purchase_id integer NOT NULL,
    purchase_code text NOT NULL,
    product_id bigint,
    quantity bigint NOT NULL,
    cost_price numeric(10,2) NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_cost numeric(10,2) NOT NULL,
    CONSTRAINT chk_purchases_cost_price CHECK ((cost_price >= (0)::numeric)),
    CONSTRAINT chk_purchases_quantity CHECK ((quantity > 0)),
    CONSTRAINT purchases_cost_price_check CHECK ((cost_price >= (0)::numeric)),
    CONSTRAINT purchases_quantity_check CHECK ((quantity > 0))
);
    DROP TABLE public.purchases;
       public         heap    postgres    false            �            1259    94565    purchases_purchase_id_seq    SEQUENCE     �   CREATE SEQUENCE public.purchases_purchase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.purchases_purchase_id_seq;
       public          postgres    false    220            g           0    0    purchases_purchase_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.purchases_purchase_id_seq OWNED BY public.purchases.purchase_id;
          public          postgres    false    219            �            1259    94583    sales    TABLE     S  CREATE TABLE public.sales (
    sale_id integer NOT NULL,
    sale_code character varying(10) NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_amount numeric(10,2) DEFAULT 0 NOT NULL,
    profit numeric(10,2) DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
    DROP TABLE public.sales;
       public         heap    postgres    false            �            1259    94593    sales_items    TABLE     �  CREATE TABLE public.sales_items (
    sales_item_id integer NOT NULL,
    sale_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity bigint NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    profit numeric(10,2) DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT sales_items_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT sales_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);
    DROP TABLE public.sales_items;
       public         heap    postgres    false            �            1259    94592    sales_items_sales_item_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sales_items_sales_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.sales_items_sales_item_id_seq;
       public          postgres    false    224            h           0    0    sales_items_sales_item_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.sales_items_sales_item_id_seq OWNED BY public.sales_items.sales_item_id;
          public          postgres    false    223            �            1259    94582    sales_sale_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sales_sale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.sales_sale_id_seq;
       public          postgres    false    222            i           0    0    sales_sale_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.sales_sale_id_seq OWNED BY public.sales.sale_id;
          public          postgres    false    221            �            1259    94632    sessions    TABLE     �   CREATE TABLE public.sessions (
    session_id integer NOT NULL,
    user_id integer,
    jwt_token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.sessions;
       public         heap    postgres    false            �            1259    94631    sessions_session_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sessions_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.sessions_session_id_seq;
       public          postgres    false    230            j           0    0    sessions_session_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.sessions_session_id_seq OWNED BY public.sessions.session_id;
          public          postgres    false    229            �            1259    94621    users    TABLE     �  CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY (ARRAY[('admin'::character varying)::text, ('cashier'::character varying)::text, ('reseller'::character varying)::text])))
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    94620    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false    228            k           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          postgres    false    227            t           2604    94536    categories category_id    DEFAULT     �   ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);
 E   ALTER TABLE public.categories ALTER COLUMN category_id DROP DEFAULT;
       public          postgres    false    215    216    216            �           2604    94615    expenses expense_id    DEFAULT     z   ALTER TABLE ONLY public.expenses ALTER COLUMN expense_id SET DEFAULT nextval('public.expenses_expense_id_seq'::regclass);
 B   ALTER TABLE public.expenses ALTER COLUMN expense_id DROP DEFAULT;
       public          postgres    false    225    226    226            u           2604    94549    products product_id    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    218    217    218            y           2604    94569    purchases purchase_id    DEFAULT     ~   ALTER TABLE ONLY public.purchases ALTER COLUMN purchase_id SET DEFAULT nextval('public.purchases_purchase_id_seq'::regclass);
 D   ALTER TABLE public.purchases ALTER COLUMN purchase_id DROP DEFAULT;
       public          postgres    false    219    220    220            {           2604    94586    sales sale_id    DEFAULT     n   ALTER TABLE ONLY public.sales ALTER COLUMN sale_id SET DEFAULT nextval('public.sales_sale_id_seq'::regclass);
 <   ALTER TABLE public.sales ALTER COLUMN sale_id DROP DEFAULT;
       public          postgres    false    222    221    222                       2604    94596    sales_items sales_item_id    DEFAULT     �   ALTER TABLE ONLY public.sales_items ALTER COLUMN sales_item_id SET DEFAULT nextval('public.sales_items_sales_item_id_seq'::regclass);
 H   ALTER TABLE public.sales_items ALTER COLUMN sales_item_id DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    94635    sessions session_id    DEFAULT     z   ALTER TABLE ONLY public.sessions ALTER COLUMN session_id SET DEFAULT nextval('public.sessions_session_id_seq'::regclass);
 B   ALTER TABLE public.sessions ALTER COLUMN session_id DROP DEFAULT;
       public          postgres    false    230    229    230            �           2604    94624    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    227    228    228            O          0    94533 
   categories 
   TABLE DATA           k   COPY public.categories (category_id, category_code, name, description, created_at, updated_at) FROM stdin;
    public          postgres    false    216   �k       Y          0    94612    expenses 
   TABLE DATA           I   COPY public.expenses (expense_id, description, amount, date) FROM stdin;
    public          postgres    false    226   nl       Q          0    94546    products 
   TABLE DATA           �   COPY public.products (product_id, product_code, name, cost_price, selling_price, stock, category_id, created_at, updated_at) FROM stdin;
    public          postgres    false    218   �l       S          0    94566 	   purchases 
   TABLE DATA           s   COPY public.purchases (purchase_id, purchase_code, product_id, quantity, cost_price, date, total_cost) FROM stdin;
    public          postgres    false    220   m       U          0    94583    sales 
   TABLE DATA           g   COPY public.sales (sale_id, sale_code, date, total_amount, profit, created_at, updated_at) FROM stdin;
    public          postgres    false    222   `m       W          0    94593    sales_items 
   TABLE DATA           �   COPY public.sales_items (sales_item_id, sale_id, product_id, quantity, unit_price, total_price, profit, created_at, updated_at) FROM stdin;
    public          postgres    false    224   �m       ]          0    94632    sessions 
   TABLE DATA           Z   COPY public.sessions (session_id, user_id, jwt_token, expires_at, created_at) FROM stdin;
    public          postgres    false    230   in       [          0    94621    users 
   TABLE DATA           Q   COPY public.users (user_id, name, email, password, role, created_at) FROM stdin;
    public          postgres    false    228   �n       l           0    0    categories_category_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.categories_category_id_seq', 16, true);
          public          postgres    false    215            m           0    0    expenses_expense_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.expenses_expense_id_seq', 1, false);
          public          postgres    false    225            n           0    0    products_product_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.products_product_id_seq', 9, true);
          public          postgres    false    217            o           0    0    purchases_purchase_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.purchases_purchase_id_seq', 3, true);
          public          postgres    false    219            p           0    0    sales_items_sales_item_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.sales_items_sales_item_id_seq', 4, true);
          public          postgres    false    223            q           0    0    sales_sale_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.sales_sale_id_seq', 3, true);
          public          postgres    false    221            r           0    0    sessions_session_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.sessions_session_id_seq', 1, false);
          public          postgres    false    229            s           0    0    users_user_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_user_id_seq', 1, true);
          public          postgres    false    227            �           2606    94659 '   categories categories_category_code_key 
   CONSTRAINT     k   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_code_key UNIQUE (category_code);
 Q   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_category_code_key;
       public            postgres    false    216            �           2606    94544    categories categories_name_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);
 H   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_name_key;
       public            postgres    false    216            �           2606    94540    categories categories_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    216            �           2606    94619    expenses expenses_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (expense_id);
 @   ALTER TABLE ONLY public.expenses DROP CONSTRAINT expenses_pkey;
       public            postgres    false    226            �           2606    94557    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    218            �           2606    94674 "   products products_product_code_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_product_code_key UNIQUE (product_code);
 L   ALTER TABLE ONLY public.products DROP CONSTRAINT products_product_code_key;
       public            postgres    false    218            �           2606    94574    purchases purchases_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (purchase_id);
 B   ALTER TABLE ONLY public.purchases DROP CONSTRAINT purchases_pkey;
       public            postgres    false    220            �           2606    94760 %   purchases purchases_purchase_code_key 
   CONSTRAINT     i   ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_purchase_code_key UNIQUE (purchase_code);
 O   ALTER TABLE ONLY public.purchases DROP CONSTRAINT purchases_purchase_code_key;
       public            postgres    false    220            �           2606    94600    sales_items sales_items_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT sales_items_pkey PRIMARY KEY (sales_item_id);
 F   ALTER TABLE ONLY public.sales_items DROP CONSTRAINT sales_items_pkey;
       public            postgres    false    224            �           2606    94589    sales sales_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (sale_id);
 :   ALTER TABLE ONLY public.sales DROP CONSTRAINT sales_pkey;
       public            postgres    false    222            �           2606    94719    sales sales_sale_code_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_sale_code_key UNIQUE (sale_code);
 C   ALTER TABLE ONLY public.sales DROP CONSTRAINT sales_sale_code_key;
       public            postgres    false    222            �           2606    94640    sessions sessions_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_id);
 @   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
       public            postgres    false    230            �           2606    94630    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    228            �           2606    94628    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    228            �           1259    94681    idx_products_category_id    INDEX     T   CREATE INDEX idx_products_category_id ON public.products USING btree (category_id);
 ,   DROP INDEX public.idx_products_category_id;
       public            postgres    false    218            �           1259    94647    idx_sales_date    INDEX     @   CREATE INDEX idx_sales_date ON public.sales USING btree (date);
 "   DROP INDEX public.idx_sales_date;
       public            postgres    false    222            �           1259    94758    idx_sales_items_product_id    INDEX     X   CREATE INDEX idx_sales_items_product_id ON public.sales_items USING btree (product_id);
 .   DROP INDEX public.idx_sales_items_product_id;
       public            postgres    false    224            �           1259    94757    idx_sales_items_sale_id    INDEX     R   CREATE INDEX idx_sales_items_sale_id ON public.sales_items USING btree (sale_id);
 +   DROP INDEX public.idx_sales_items_sale_id;
       public            postgres    false    224            �           1259    94649    idx_sessions_user_id    INDEX     L   CREATE INDEX idx_sessions_user_id ON public.sessions USING btree (user_id);
 (   DROP INDEX public.idx_sessions_user_id;
       public            postgres    false    230            �           1259    94648    idx_users_email    INDEX     B   CREATE INDEX idx_users_email ON public.users USING btree (email);
 #   DROP INDEX public.idx_users_email;
       public            postgres    false    228            �           2620    94809    categories set_category_code    TRIGGER     �   CREATE TRIGGER set_category_code BEFORE INSERT ON public.categories FOR EACH ROW WHEN (((new.category_code IS NULL) OR ((new.category_code)::text = ''::text))) EXECUTE FUNCTION public.generate_category_code();
 5   DROP TRIGGER set_category_code ON public.categories;
       public          postgres    false    216    216    231            �           2606    94712    products fk_categories_products    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_categories_products FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON UPDATE CASCADE ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.products DROP CONSTRAINT fk_categories_products;
       public          postgres    false    218    216    4760            �           2606    94815    products fk_products_category    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON UPDATE CASCADE ON DELETE SET NULL;
 G   ALTER TABLE ONLY public.products DROP CONSTRAINT fk_products_category;
       public          postgres    false    218    216    4760            �           2606    94820    purchases fk_purchases_product    FK CONSTRAINT     �   ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT fk_purchases_product FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON UPDATE CASCADE ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.purchases DROP CONSTRAINT fk_purchases_product;
       public          postgres    false    4763    220    218            �           2606    94752    sales_items fk_sales_items    FK CONSTRAINT     �   ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT fk_sales_items FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.sales_items DROP CONSTRAINT fk_sales_items;
       public          postgres    false    222    4772    224            �           2606    94682 "   products products_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON UPDATE CASCADE ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.products DROP CONSTRAINT products_category_id_fkey;
       public          postgres    false    218    216    4760            �           2606    94770 #   purchases purchases_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.purchases DROP CONSTRAINT purchases_product_id_fkey;
       public          postgres    false    220    218    4763            �           2606    94737 '   sales_items sales_items_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT sales_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.sales_items DROP CONSTRAINT sales_items_product_id_fkey;
       public          postgres    false    224    218    4763            �           2606    94728 $   sales_items sales_items_sale_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sales_items
    ADD CONSTRAINT sales_items_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.sales_items DROP CONSTRAINT sales_items_sale_id_fkey;
       public          postgres    false    222    4772    224            �           2606    94641    sessions sessions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_user_id_fkey;
       public          postgres    false    230    228    4785            O   �   x�]��
�  g������Ec�ܭ�_�EZS���C��B�R8��8�LJdg����������%e1��Vx�Rw6�����X7#�C�K}��ӣi;2#I�C�p���F�f��x��V� M�S�|��/ٙ.      Y      x������ � �      Q   z   x�u�;1�zr��(�=��$�8 7���X	(��AP >�K~nh(�u���v�N1 �gv
�(�$2�Gp,u��B%}�h���r��g���w'������ssU���|���9�p+o      S   ;   x�3���440�4500��FF&������
�V&FVFFzf�&�`%`E\1z\\\ )�
      U   j   x�}�1�@k��֮�w]�����)	�V#�HKy�ύ>E��c$G��#:k�-S��<��p_���������0��lEB
�8�����{�)u7U= �<,f      W      x���M
B1��)��+��Ӵ=˻�9L�OP���2$d�����3Y(o;��Ƙf�{#�ڝ���H�9A�>�ZN]����f����U�T��\���M����S�v-���~����g-�< K�D�      ]      x������ � �      [   ~   x�3��LL���sH�H�-�I�K���T1JT14Pq3(,�pLJ�7u�̍J�*/,u/*���3�5	�O��3Lwv1�(ptJI��H*��id`d�kh�kh�```ejnel�g`fn`�m`����� '�"�     