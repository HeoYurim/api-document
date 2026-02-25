package com.project.entity

import jakarta.persistence.*

@Entity
@Table(name = "project")
class Project(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var name: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    var creator: User,

    @Column(nullable = false, length = 20)
    var status: String = "ACTIVE"
) : BaseTimeEntity() {

    fun update(name: String, description: String?, status: String) {
        this.name = name
        this.description = description
        this.status = status
    }

    fun toggleStatus() {
        this.status = if (this.status == "ACTIVE") "FADEOUT" else "ACTIVE"
    }
}
